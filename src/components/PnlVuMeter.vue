<script setup>
/*
 * Пресет «Аналог»: окошко стрелочного VU-индикатора, как на ламповом компрессоре.
 * Стрелка показывает суточный PnL на шкале −50…+50 (нелинейно, как у настоящего VU:
 * у нуля деления шире), левая «минусовая» часть шкалы красная.
 */
import { computed, ref, onMounted } from "vue";

const props = defineProps({
    value: { type: Number, default: 0 }, // суточный PnL числом
    text: { type: String, default: "" }, // как показать число: «+11.3»
    unrealized: { type: String, default: "" },
});

const RANGE = 50; // крайние деления шкалы
const MAX_ANGLE = 48; // отклонение стрелки в градусах
const CX = 140; // ось стрелки (под окошком)
const CY = 168;
const R = 128; // радиус шкалы

// Нелинейная шкала: корень, чтобы малые значения было видно
const toAngle = (v) => {
    const k = Math.min(1, Math.sqrt(Math.abs(v) / RANGE));
    return Math.sign(v) * k * MAX_ANGLE;
};
const polar = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arc = (from, to, r) => {
    const [x1, y1] = polar(from, r);
    const [x2, y2] = polar(to, r);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

const labels = [-50, -20, -5, 0, 5, 20, 50];
const minor = [-35, -10, -2, 2, 10, 35];
const ticks = computed(() =>
    [...labels.map((v) => ({ v, big: true })), ...minor.map((v) => ({ v, big: false }))].map((t) => {
        const a = toAngle(t.v);
        const [x1, y1] = polar(a, R);
        const [x2, y2] = polar(a, R - (t.big ? 10 : 6));
        const [lx, ly] = polar(a, R + 9);
        return { ...t, x1, y1, x2, y2, lx, ly, label: t.v > 0 ? `+${t.v}` : String(t.v) };
    }),
);

// Стрелка «поднимается» из нуля при загрузке, как у включённого прибора
const shown = ref(false);
onMounted(() => requestAnimationFrame(() => (shown.value = true)));
const needleAngle = computed(() => (shown.value ? toAngle(props.value) : -MAX_ANGLE - 4));
const down = computed(() => props.value < 0);
</script>

<template>
    <div class="vu" :class="{ 'vu--down': down }">
        <svg class="vu__scale" viewBox="0 0 280 132" aria-hidden="true">
            <!-- шкала: минус красный, плюс чёрный -->
            <path :d="arc(-MAX_ANGLE, 0, R)" class="vu__arc vu__arc--red" />
            <path :d="arc(0, MAX_ANGLE, R)" class="vu__arc" />
            <line
                v-for="t in ticks"
                :key="t.v"
                :x1="t.x1"
                :y1="t.y1"
                :x2="t.x2"
                :y2="t.y2"
                class="vu__tick"
                :class="{ 'vu__tick--red': t.v < 0, 'vu__tick--big': t.big }"
            />
            <text
                v-for="t in ticks.filter((t) => t.big)"
                :key="'l' + t.v"
                :x="t.lx"
                :y="t.ly"
                class="vu__label"
                :class="{ 'vu__label--red': t.v < 0 }"
            >{{ t.label }}</text>
            <text x="22" y="30" class="vu__corner vu__corner--red">−</text>
            <text x="258" y="30" class="vu__corner">+</text>
            <!-- стрелка: ось ниже окошка, видно только её верх -->
            <line
                class="vu__needle"
                :x1="CX"
                :y1="CY"
                :x2="CX"
                :y2="CY - R + 6"
                :style="{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${CX}px ${CY}px` }"
            />
        </svg>

        <div class="vu__value">{{ text }}</div>
        <div class="vu__unr">{{ unrealized }} Unr.</div>
        <div class="vu__brand">VATAGA</div>
        <div class="vu__glass"></div>
    </div>
</template>

<style scoped>
/* Окошко прибора: тёплая подсвеченная шкала за стеклом */
.vu {
    position: relative;
    height: 132px;
    overflow: hidden;
    border-radius: 4px;
    background: radial-gradient(120% 110% at 50% 35%, #fbf0c9 0%, #f0dca2 55%, #d8bf7c 100%);
    box-shadow:
        inset 0 3px 8px rgba(40, 25, 0, 0.55),
        inset 0 0 0 1px rgba(40, 25, 0, 0.5),
        0 1px 0 rgba(255, 255, 255, 0.35);
    color: #2b2116;
    font-family: "Times New Roman", Georgia, serif;
}
.vu__scale {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.vu__arc {
    fill: none;
    stroke: #2b2116;
    stroke-width: 1.4;
}
.vu__arc--red {
    stroke: #c0281e;
    stroke-width: 3.5;
}
.vu__tick {
    stroke: #2b2116;
    stroke-width: 1;
}
.vu__tick--big {
    stroke-width: 1.6;
}
.vu__tick--red {
    stroke: #c0281e;
}
.vu__label {
    font-size: 9px;
    fill: #2b2116;
    text-anchor: middle;
    dominant-baseline: middle;
}
.vu__label--red {
    fill: #c0281e;
}
.vu__corner {
    font-size: 15px;
    font-weight: 700;
    fill: #2b2116;
    text-anchor: middle;
}
.vu__corner--red {
    fill: #c0281e;
}

/* Стрелка */
.vu__needle {
    stroke: #1a1410;
    stroke-width: 1.5;
    stroke-linecap: round;
    transform-box: view-box;
    transition: transform 1.2s cubic-bezier(0.22, 1.4, 0.36, 1);
    filter: drop-shadow(1px 2px 1px rgba(40, 25, 0, 0.3));
}

.vu__value {
    position: absolute;
    left: 0;
    right: 0;
    top: 58px;
    text-align: center;
    font-family: var(--font-family);
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #1d1710;
    text-shadow: 0 0 6px #f6e6b4, 0 0 2px #f6e6b4;
    z-index: 2;
}
.vu--down .vu__value {
    color: #b3241b;
}
.vu__unr {
    position: absolute;
    left: 0;
    right: 0;
    top: 98px;
    text-align: center;
    font-family: var(--font-family);
    font-size: 11px;
    font-weight: 600;
    color: #b3241b;
    z-index: 2;
}
.vu__brand {
    position: absolute;
    left: 10px; /* справа кнопка «Поделиться» */
    bottom: 7px;
    font-family: var(--font-family);
    font-size: 10px;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.06em;
    color: #2b2116;
    z-index: 2;
}
/* Блик на стекле */
.vu__glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 36%);
    pointer-events: none;
    z-index: 3;
}
</style>
