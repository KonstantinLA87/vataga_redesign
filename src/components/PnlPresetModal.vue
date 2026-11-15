<script setup>
/*
 * Модалка выбора пресета виджета «Суточный PnL».
 * v-model — id выбранного пресета ('minimal' | 'vu' | 'accent').
 */
import { ref, watch, onMounted, onUnmounted } from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    open: Boolean,
    modelValue: String,
});
const emit = defineEmits(["update:modelValue", "close"]);

const presets = [
    { id: "minimal", title: "Минимал", text: "Без карточки: только цифры на фоне страницы." },
    { id: "vu", title: "Аналог", text: "Окошко стрелочного прибора, как на ламповом компрессоре. Стрелка показывает PnL." },
    { id: "accent", title: "Акцент", text: "Карточка с цветной рамкой по знаку PnL, днём солнце, ночью луна." },
];

const draft = ref(props.modelValue);
watch(
    () => props.open,
    (o) => {
        if (o) draft.value = props.modelValue;
    },
);

function apply() {
    emit("update:modelValue", draft.value);
    emit("close");
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
                <div class="modal" role="dialog" aria-modal="true" aria-labelledby="preset-title">
                    <div class="modal__head">
                        <h3 id="preset-title">Пресет виджета</h3>
                        <button class="modal__close" @click="emit('close')"><Icon name="close" :size="16" /></button>
                    </div>
                    <p class="modal__sub">Выберите, как выглядит карточка «Суточный PnL».</p>

                    <div class="options">
                        <button
                            v-for="p in presets"
                            :key="p.id"
                            class="option"
                            :class="{ 'option--on': draft === p.id }"
                            @click="draft = p.id"
                        >
                            <!-- Мини-превью -->
                            <div class="preview" :class="'preview--' + p.id">
                                <div class="preview__title">Суточный PnL</div>
                                <div class="preview__value">+11.3</div>
                                <div class="preview__unr">-759 Unr.</div>
                                <span v-if="p.id === 'accent'" class="preview__sun"></span>
                                <span v-if="p.id === 'vu'" class="preview__needle"></span>
                            </div>
                            <div class="option__meta">
                                <span class="radio"><Icon v-if="draft === p.id" name="check" :size="12" /></span>
                                <div>
                                    <div class="option__title">{{ p.title }}</div>
                                    <div class="option__text">{{ p.text }}</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div class="modal__foot">
                        <button class="btn-cancel" @click="emit('close')">Отмена</button>
                        <button class="btn-primary" @click="apply">Применить</button>
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
    width: 760px;
    max-width: 100%;
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
.modal__sub {
    margin: 6px 0 var(--space-5);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
}

.options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
}
.option {
    text-align: left;
    padding: var(--space-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--bg-page);
    transition: border-color 0.15s, box-shadow 0.15s;
}
.option:hover {
    border-color: var(--accent-muted);
}
.option--on {
    border-color: var(--accent);
    box-shadow: var(--focus-ring);
}

.preview {
    position: relative;
    height: 110px;
    padding: 12px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.preview__title {
    font-size: 10px;
    color: var(--text-secondary);
}
.preview__value {
    margin-top: 6px;
    font-size: 22px;
    font-weight: 700;
    color: var(--success-text);
    letter-spacing: -0.02em;
}
.preview__unr {
    align-self: flex-start;
    margin-top: 4px;
    font-size: 9px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--danger-text);
    background: var(--danger-soft);
}
/* «Аналог»: серая панель, тёплое окошко, стрелка */
.preview--vu {
    align-items: center;
    padding: 8px;
    background: linear-gradient(180deg, #9a9ea6, #666a73);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.preview--vu::before {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 3px;
    background: radial-gradient(120% 110% at 50% 35%, #fbf0c9, #f0dca2 55%, #d8bf7c);
    box-shadow: inset 0 2px 6px rgba(40, 25, 0, 0.5);
}
.preview--vu > * {
    position: relative;
}
.preview--vu .preview__title {
    margin-top: 6px;
    font-size: 8px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #5a4a33;
}
.preview--vu .preview__value {
    margin-top: 4px;
    color: #1d1710;
}
.preview--vu .preview__unr {
    align-self: center;
    background: none;
    color: #b3241b;
}
.preview__needle {
    position: absolute !important;
    left: 50%;
    bottom: -18px;
    width: 1.5px;
    height: 96px;
    background: #1a1410;
    transform-origin: 50% 100%;
    transform: rotate(18deg);
    opacity: 0.85;
}
.preview--accent {
    align-items: center;
    border: 1px solid rgba(31, 199, 126, 0.4);
    background:
        radial-gradient(120% 90% at 50% 120%, rgba(31, 199, 126, 0.16), transparent 65%),
        var(--bg-card);
}
.preview--accent .preview__title {
    align-self: flex-start;
}
.preview--accent .preview__value {
    margin-top: 8px;
}
.preview--accent .preview__unr {
    align-self: center;
    border-radius: 999px;
}
.preview__sun {
    position: absolute;
    left: 50%;
    bottom: -30px;
    width: 44px;
    height: 44px;
    margin-left: -22px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 40%, #fff4c2, #ffd45c 40%, #ff9f43);
    box-shadow: 0 0 20px 4px rgba(255, 180, 70, 0.35);
}

.option__meta {
    display: flex;
    gap: 10px;
    margin-top: var(--space-3);
}
.radio {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    border-radius: 50%;
    border: 1.5px solid var(--border-strong);
    display: grid;
    place-items: center;
    color: #fff;
}
.option--on .radio {
    border-color: var(--accent);
    background: var(--accent);
}
.option__title {
    font-size: var(--fs-md);
    font-weight: 600;
}
.option__text {
    margin-top: 2px;
    font-size: var(--fs-xs);
    line-height: 1.4;
    color: var(--text-muted);
}

.modal__foot {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-5);
}
.btn-cancel {
    height: 34px;
    padding: 0 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    font-weight: 500;
}
.btn-cancel:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
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

@media (max-width: 560px) {
    .options {
        grid-template-columns: 1fr;
    }
}
</style>
