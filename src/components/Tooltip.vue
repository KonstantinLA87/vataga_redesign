<script setup>
/*
 * Тултип при наведении (и при фокусе с клавиатуры).
 * Пузырь телепортируется в body, поэтому его не обрезает overflow: hidden у карточек.
 *
 * <Tooltip text="Подсказка"><Icon name="info" /></Tooltip>
 * placement: 'top' (по умолчанию) | 'bottom'
 */
import { ref, nextTick, onUnmounted } from "vue";

const props = defineProps({
    text: { type: String, required: true },
    placement: { type: String, default: "top" },
    maxWidth: { type: Number, default: 280 },
});

const trigger = ref(null);
const bubble = ref(null);
const open = ref(false);
const pos = ref({ top: 0, left: 0, side: props.placement });
const id = "tt-" + Math.random().toString(36).slice(2, 8);
const GAP = 8;
const EDGE = 12;

async function show() {
    open.value = true;
    await nextTick();
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
}
function hide() {
    open.value = false;
    window.removeEventListener("scroll", place, true);
    window.removeEventListener("resize", place);
}
function place() {
    if (!trigger.value || !bubble.value) return;
    const t = trigger.value.getBoundingClientRect();
    const b = bubble.value.getBoundingClientRect();
    let side = props.placement;
    // Если сверху не помещается — показываем снизу, и наоборот
    if (side === "top" && t.top - b.height - GAP < EDGE) side = "bottom";
    else if (side === "bottom" && t.bottom + b.height + GAP > window.innerHeight - EDGE) side = "top";
    const top = side === "top" ? t.top - b.height - GAP : t.bottom + GAP;
    let left = t.left + t.width / 2 - b.width / 2;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - b.width - EDGE));
    // Стрелка всегда указывает на центр триггера
    const arrow = t.left + t.width / 2 - left;
    pos.value = { top, left, side, arrow };
}
onUnmounted(hide);
</script>

<template>
    <span
        ref="trigger"
        class="tt-trigger"
        tabindex="0"
        :aria-describedby="open ? id : undefined"
        @mouseenter="show"
        @mouseleave="hide"
        @focus="show"
        @blur="hide"
    >
        <slot />
    </span>
    <Teleport to="body">
        <Transition name="tt">
            <div
                v-if="open"
                :id="id"
                ref="bubble"
                role="tooltip"
                class="tt"
                :class="'tt--' + pos.side"
                :style="{ top: pos.top + 'px', left: pos.left + 'px', maxWidth: props.maxWidth + 'px', '--arrow': pos.arrow + 'px' }"
            >
                {{ text }}
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.tt-trigger {
    display: inline-flex;
    align-items: center;
    cursor: help;
    border-radius: 50%;
    outline: none;
}
.tt-trigger:focus-visible {
    box-shadow: var(--focus-ring);
}
.tt {
    position: fixed;
    z-index: 200;
    padding: 10px 12px;
    font-size: var(--fs-xs);
    line-height: 1.5;
    font-weight: 400;
    color: var(--text-primary);
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    pointer-events: none;
    text-transform: none;
    letter-spacing: normal;
    white-space: normal;
}
/* Стрелочка */
.tt::after {
    content: "";
    position: absolute;
    left: var(--arrow, 50%);
    width: 8px;
    height: 8px;
    margin-left: -4px;
    background: inherit;
    border: inherit;
    transform: rotate(45deg);
}
.tt--top::after {
    bottom: -5px;
    border-top: 0;
    border-left: 0;
}
.tt--bottom::after {
    top: -5px;
    border-bottom: 0;
    border-right: 0;
}
.tt-enter-active,
.tt-leave-active {
    transition: opacity 0.12s, transform 0.12s;
}
.tt--top.tt-enter-from,
.tt--top.tt-leave-to {
    opacity: 0;
    transform: translateY(4px);
}
.tt--bottom.tt-enter-from,
.tt--bottom.tt-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
