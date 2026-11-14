/*
 * Рисует картинку «Поделиться PnL» на canvas 1080×1080 (квадрат под соцсети).
 * Всё на canvas, чтобы картинку можно было честно скопировать в буфер или скачать.
 */
import logoUrl from "../assets/img/logo-dark.svg";

export const SHARE_SIZE = 1080;

const C = {
    bg: "#090814",
    brand: "135, 62, 254",
    up: "31, 199, 126",
    upLight: "#8dffc8",
    down: "242, 73, 92",
    downLight: "#ffb0b9",
};

let logoPromise;
function loadLogo() {
    logoPromise ??= new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = logoUrl;
    });
    return logoPromise;
}

/** 1234.5 -> "+1 234.50" */
export function formatPnl(n) {
    const sign = n > 0 ? "+" : n < 0 ? "−" : "";
    const [int, frac] = Math.abs(n).toFixed(2).split(".");
    return sign + int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "." + frac;
}

function rgba(rgb, a) {
    return `rgba(${rgb}, ${a})`;
}

function glow(ctx, x, y, r, rgb, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(rgb, a));
    g.addColorStop(1, rgba(rgb, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SHARE_SIZE, SHARE_SIZE);
}

function pill(ctx, text, x, y, { font, color, bg, border, padX = 22, h = 52, align = "left" }) {
    ctx.font = font;
    const w = ctx.measureText(text).width + padX * 2;
    const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    ctx.beginPath();
    ctx.roundRect(left, y, w, h, h / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    if (border) {
        ctx.strokeStyle = border;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, left + padX, y + h / 2 + 1);
    return w;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ value:number, includeUnrealized:boolean, unrealized:number, series:number[],
 *           account:string, market:string, date:string, tz:string, style?:'vivid'|'accent' }} d
 *
 * style: 'vivid' — «Сочный» (свечения, градиенты, плавный график),
 *        'accent' — «Акцент» (как пресет карточки: рамка и свечение по знаку PnL, снизу выглядывает солнце).
 */
export async function drawPnlShare(canvas, d) {
    const S = SHARE_SIZE;
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    await document.fonts?.ready;
    const logo = await loadLogo().catch(() => null);

    const up = d.value >= 0;
    const sign = up ? C.up : C.down;
    const light = up ? C.upLight : C.downLight;
    const accent = d.style === "accent";

    /* ---------- Фон ---------- */
    const cx = S / 2;
    const cy = 560; // центр числа
    if (accent) {
        drawAccentBackground(ctx, sign);
    } else {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, S, S);
        glow(ctx, S * 0.12, S * 0.05, 760, C.brand, 0.62);
        glow(ctx, S * 0.95, S * 0.98, 720, sign, 0.42);
        glow(ctx, S * 0.5, S * 0.52, 420, C.brand, 0.18);

        // Сетка
        ctx.strokeStyle = "rgba(255,255,255,0.045)";
        ctx.lineWidth = 1;
        for (let i = 60; i < S; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i + 0.5, 0);
            ctx.lineTo(i + 0.5, S);
            ctx.moveTo(0, i + 0.5);
            ctx.lineTo(S, i + 0.5);
            ctx.stroke();
        }
        // Кольца вокруг числа
        [250, 360, 480].forEach((r, i) => {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${0.07 - i * 0.018})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        // Виньетка по краям
        const vg = ctx.createRadialGradient(cx, S / 2, S * 0.35, cx, S / 2, S * 0.78);
        vg.addColorStop(0, "rgba(9,8,20,0)");
        vg.addColorStop(1, "rgba(9,8,20,0.75)");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, S, S);
    }

    /* ---------- Всё по центру: логотип → подпись → дата → число → чип ---------- */
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (logo) {
        const lw = 460;
        const lh = (lw * logo.naturalHeight) / logo.naturalWidth || lw * (33 / 228);
        ctx.drawImage(logo, cx - lw / 2, 45, lw, lh);
    }

    ctx.font = "600 44px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillText("Суточный PnL, USDT", cx, 205);

    // Дата в овале
    pill(ctx, d.date, cx, 262, {
        font: "700 69px Inter, sans-serif",
        color: "#ffffff",
        bg: "rgba(255,255,255,0.08)",
        border: "rgba(255,255,255,0.18)",
        align: "center",
        h: 112,
        padX: 50,
    });
    ctx.textAlign = "center";

    if ("letterSpacing" in ctx) ctx.letterSpacing = "-4px";
    const text = formatPnl(d.value);
    let size = 210;
    ctx.font = `800 ${size}px Inter, sans-serif`;
    while (ctx.measureText(text).width > 920 && size > 90) {
        size -= 6;
        ctx.font = `800 ${size}px Inter, sans-serif`;
    }
    const tg = ctx.createLinearGradient(0, cy - size / 2, 0, cy + size / 2);
    tg.addColorStop(0, light);
    tg.addColorStop(1, rgba(sign, 1));
    ctx.shadowColor = rgba(sign, 0.65);
    ctx.shadowBlur = accent ? 50 : 70;
    ctx.fillStyle = accent ? rgba(sign, 1) : tg;
    ctx.fillText(text, cx, cy + 10);
    ctx.shadowBlur = 0;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    // Чип: что входит в число (без повторения суммы)
    pill(ctx, d.includeUnrealized ? "с нереализованным" : "реализованный", cx, 676, {
        font: "600 38px Inter, sans-serif",
        color: up ? C.upLight : C.downLight,
        bg: rgba(sign, 0.14),
        border: rgba(sign, 0.4),
        align: "center",
        h: 74,
        padX: 34,
    });

    /* ---------- Мини-график за день ---------- */
    const s = d.series;
    if (!accent && s?.length > 1) {
        const x0 = 0;
        const x1 = S;
        const yTop = 790;
        const yBot = 930;
        const min = Math.min(...s, 0);
        const max = Math.max(...s, 0);
        const span = max - min || 1;
        const px = (i) => x0 + ((x1 - x0) * i) / (s.length - 1);
        const py = (v) => yBot - ((v - min) / span) * (yBot - yTop);

        const path = new Path2D();
        s.forEach((v, i) => {
            if (i === 0) path.moveTo(px(i), py(v));
            else {
                const xm = (px(i - 1) + px(i)) / 2;
                path.bezierCurveTo(xm, py(s[i - 1]), xm, py(v), px(i), py(v));
            }
        });
        const area = new Path2D(path);
        area.lineTo(x1, S);
        area.lineTo(x0, S);
        area.closePath();
        const ag = ctx.createLinearGradient(0, yTop, 0, S);
        ag.addColorStop(0, rgba(sign, 0.3));
        ag.addColorStop(1, rgba(sign, 0.02));
        ctx.fillStyle = ag;
        ctx.fill(area);

        ctx.strokeStyle = rgba(sign, 1);
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.shadowColor = rgba(sign, 0.8);
        ctx.shadowBlur = 20;
        ctx.stroke(path);
        ctx.shadowBlur = 0;
    }

    /* ---------- Подвал: по центру, на всю ширину ---------- */
    ctx.font = "600 36px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 12;
    const items = [d.account, d.market, d.tz];
    const pad = 80;
    const y = accent ? 845 : 1010;
    // Одинаковые промежутки между надписями, строка на всю ширину
    const widths = items.map((t) => ctx.measureText(t).width);
    const gap = (S - pad * 2 - widths.reduce((a, b) => a + b, 0)) / (items.length - 1);
    ctx.textAlign = "left";
    let x = pad;
    items.forEach((t, i) => {
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.fillText(t, x, y);
        x += widths[i];
        if (i < items.length - 1) {
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.textAlign = "center";
            ctx.fillText("·", x + gap / 2, y);
            ctx.textAlign = "left";
            x += gap;
        }
    });
    ctx.shadowBlur = 0;

    if (accent) drawSun(ctx);
}

/* ---------- Стиль «Акцент» ---------- */
function drawAccentBackground(ctx, sign) {
    const S = SHARE_SIZE;
    const R = 56;
    // фон страницы за скруглёнными углами
    ctx.fillStyle = "#0b0f1a";
    ctx.fillRect(0, 0, S, S);
    // сама карточка
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(4, 4, S - 8, S - 8, R);
    ctx.clip();
    ctx.fillStyle = "#121624";
    ctx.fillRect(0, 0, S, S);
    // свечение снизу по знаку PnL
    const g = ctx.createRadialGradient(S / 2, S * 1.15, 0, S / 2, S * 1.15, S * 0.85);
    g.addColorStop(0, rgba(sign, 0.32));
    g.addColorStop(1, rgba(sign, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    // лёгкий блик сверху
    const t = ctx.createLinearGradient(0, 0, 0, S * 0.4);
    t.addColorStop(0, "rgba(255,255,255,0.03)");
    t.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = t;
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
    // цветная рамка
    ctx.beginPath();
    ctx.roundRect(4, 4, S - 8, S - 8, R);
    ctx.strokeStyle = rgba(sign, 0.45);
    ctx.lineWidth = 4;
    ctx.stroke();
    // светящаяся полоска сверху
    const l = ctx.createLinearGradient(S * 0.2, 0, S * 0.8, 0);
    l.addColorStop(0, rgba(sign, 0));
    l.addColorStop(0.5, rgba(sign, 1));
    l.addColorStop(1, rgba(sign, 0));
    ctx.fillStyle = l;
    ctx.shadowColor = rgba(sign, 0.9);
    ctx.shadowBlur = 16;
    ctx.fillRect(S * 0.2, 3, S * 0.6, 3);
    ctx.shadowBlur = 0;
}

function drawSun(ctx) {
    const S = SHARE_SIZE;
    const r = 170;
    const x = S / 2;
    const y = S + r * 0.42; // видна верхняя часть
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(4, 4, S - 8, S - 8, 56);
    ctx.clip();
    // ореол
    const halo = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 2.6);
    halo.addColorStop(0, "rgba(255,170,70,0.35)");
    halo.addColorStop(1, "rgba(255,150,60,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, S, S);
    // лучи
    ctx.strokeStyle = "rgba(255,200,90,0.55)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(rad) * (r + 26), y + Math.sin(rad) * (r + 26));
        ctx.lineTo(x + Math.cos(rad) * (r + 66), y + Math.sin(rad) * (r + 66));
        ctx.stroke();
    }
    // диск
    const disc = ctx.createRadialGradient(x, y - r * 0.35, 0, x, y, r);
    disc.addColorStop(0, "#fff4c2");
    disc.addColorStop(0.35, "#ffd45c");
    disc.addColorStop(0.75, "#ff9f43");
    disc.addColorStop(1, "#ff7a3d");
    ctx.shadowColor = "rgba(255,180,70,0.6)";
    ctx.shadowBlur = 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = disc;
    ctx.fill();
    ctx.restore();
}
