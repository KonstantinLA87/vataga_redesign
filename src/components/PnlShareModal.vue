<script setup>
/*
 * «Поделиться PnL»: превью картинки, переключатель нереализованного PnL,
 * копирование картинки в буфер и скачивание PNG.
 */
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import Icon from "./Icon.vue";
import { drawPnlShare } from "../utils/drawPnlShare.js";
import { pnlIntraday } from "../data/mock.js";

const props = defineProps({
    open: Boolean,
    realized: { type: Number, required: true },
    unrealized: { type: Number, default: 0 },
});
const emit = defineEmits(["close"]);

const canvas = ref(null);
const includeUnrealized = ref(false);
const status = ref(""); // '' | 'copied' | 'downloaded' | 'error'

const value = computed(() => props.realized + (includeUnrealized.value ? props.unrealized : 0));

function dateInfo() {
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1].map((n) => String(n).padStart(2, "0")).join(".") + "." + d.getFullYear();
    const off = -d.getTimezoneOffset() / 60;
    const tz = "UTC" + (off >= 0 ? "+" : "−") + Math.abs(off);
    return { date, tz };
}

async function render() {
    if (!canvas.value) return;
    const last = pnlIntraday[pnlIntraday.length - 1] || 1;
    const k = value.value / last;
    await drawPnlShare(canvas.value, {
        value: value.value,
        includeUnrealized: includeUnrealized.value,
        unrealized: props.unrealized,
        series: pnlIntraday.map((v) => v * k),
        account: "Binance Link",
        market: "USDⓈ-M Futures",
        ...dateInfo(),
    });
}

watch(
    () => props.open,
    async (o) => {
        if (!o) return;
        status.value = "";
        await nextTick();
        render();
    },
);
watch(includeUnrealized, () => {
    status.value = "";
    render();
});

function toBlob() {
    return new Promise((res) => canvas.value.toBlob(res, "image/png"));
}

async function copy() {
    try {
        // Safari требует передать Promise прямо в ClipboardItem
        await navigator.clipboard.write([new ClipboardItem({ "image/png": toBlob() })]);
        flash("copied");
    } catch {
        // Браузер не дал доступ к буферу: скачиваем файл
        await download();
    }
}
async function download() {
    const blob = await toBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vataga-pnl-${dateInfo().date}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash("downloaded");
}
let t;
function flash(s) {
    status.value = s;
    clearTimeout(t);
    t = setTimeout(() => (status.value = ""), 2200);
}

function onKey(e) {
    if (props.open && e.key === "Escape") emit("close");
}
onMounted(() => document.addEventListener("keydown", onKey));
onUnmounted(() => document.removeEventListener("keydown", onKey));
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="open" class="overlay" @click.self="emit('close')">
                <div class="modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
                    <div class="modal__head">
                        <h3 id="share-title">Поделиться PnL</h3>
                        <button class="modal__close" aria-label="Закрыть" @click="emit('close')"><Icon name="close" :size="16" /></button>
                    </div>

                    <div class="preview">
                        <canvas ref="canvas" class="preview__canvas" aria-label="Картинка с PnL за день"></canvas>
                    </div>

                    <label class="switch">
                        <input v-model="includeUnrealized" type="checkbox" />
                        <span class="switch__track"><span class="switch__thumb"></span></span>
                        Учитывать нереализованный PnL
                    </label>

                    <div class="modal__foot">
                        <span class="status" :class="{ 'status--on': status }">
                            <Icon name="check" :size="14" />
                            {{ status === "downloaded" ? "Картинка скачана" : "Скопировано в буфер" }}
                        </span>
                        <button class="btn-secondary" @click="download"><Icon name="download" :size="16" /> Скачать</button>
                        <button class="btn-primary" @click="copy"><Icon name="copy" :size="16" /> Копировать картинку</button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: var(--space-4);
    background: rgba(5, 7, 14, 0.6);
    backdrop-filter: blur(6px);
}
.modal {
    width: 560px;
    max-width: 100%;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    padding: var(--space-5);
    background: var(--bg-card);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}
.modal__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
}
.modal__head h3 {
    margin: 0;
    font-size: var(--fs-xl);
    font-weight: 700;
}
.modal__close {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
}
.modal__close:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

.preview {
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 20px 60px -20px rgba(135, 62, 254, 0.45);
}
.preview__canvas {
    display: block;
    width: 100%;
    aspect-ratio: 1;
}

.switch {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: var(--space-4);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    cursor: pointer;
    user-select: none;
}
.switch input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.switch__track {
    position: relative;
    width: 38px;
    height: 22px;
    border-radius: 999px;
    background: var(--bg-elevated-hover);
    transition: background 0.15s;
    flex-shrink: 0;
}
.switch__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s;
}
.switch input:checked + .switch__track {
    background: var(--accent);
}
.switch input:checked + .switch__track .switch__thumb {
    transform: translateX(16px);
}
.switch input:focus-visible + .switch__track {
    box-shadow: var(--focus-ring);
}

.modal__foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-5);
}
.btn-primary,
.btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}
.btn-secondary {
    height: 34px;
    padding: 0 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    font-weight: 500;
}
.btn-secondary:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}
.status {
    margin-right: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--fs-sm);
    color: var(--success-text);
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.2s, transform 0.2s;
}
.status--on {
    opacity: 1;
    transform: none;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.18s;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
    transition: transform 0.18s;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
    transform: translateY(8px) scale(0.98);
}
</style>
