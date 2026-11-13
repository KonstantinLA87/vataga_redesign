<script setup>
import Icon from './Icon.vue'
import { computed } from 'vue'
import { pnl } from '../data/mock.js'

const isUp = computed(() => !String(pnl.value).startsWith('-'))
</script>

<template>
  <section class="card pnl" :class="isUp ? 'pnl--up' : 'pnl--down'">
    <div class="pnl__head">
      <span class="pnl__title">Суточный PnL, USDT <Icon name="info" :size="15" /></span>
      <button class="pnl__more"><Icon name="more" :size="24" /></button>
    </div>
    <div class="pnl__body">
      <div class="pnl__value" :class="isUp ? 'pos' : 'neg'">{{ isUp ? '+' : '' }}{{ pnl.value }}</div>
      <div class="pnl__unr neg">{{ pnl.unrealized }} Unr.</div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Вариант B: акцентная карточка.
 * Цветное свечение и рамка зависят от знака PnL (зелёный в плюсе, красный в минусе).
 */
.pnl {
    --pnl-color: var(--success);
    --pnl-glow: rgba(31, 199, 126, 0.16);
    --pnl-border: rgba(31, 199, 126, 0.35);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--space-4) var(--space-5);
    overflow: hidden;
    border-color: var(--pnl-border);
    background:
        radial-gradient(120% 90% at 50% 120%, var(--pnl-glow), transparent 65%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 40%),
        var(--bg-card);
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.02) inset,
        0 12px 40px -12px var(--pnl-glow);
}
.pnl--down {
    --pnl-color: var(--danger);
    --pnl-glow: rgba(242, 73, 92, 0.16);
    --pnl-border: rgba(242, 73, 92, 0.35);
}
/* Тонкая светящаяся полоска сверху */
.pnl::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--pnl-color), transparent);
    opacity: 0.8;
}
.pnl__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.pnl__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
}
.pnl__title :deep(svg) {
    color: var(--text-muted);
}
.pnl__more {
    color: var(--text-muted);
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-sm);
}
.pnl__more:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}
/* Число по центру карточки */
.pnl__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: var(--space-2) 0 var(--space-3);
}
.pnl__value {
    font-size: 44px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.03em;
    text-shadow: 0 0 24px var(--pnl-glow);
}
.pnl__unr {
    font-size: var(--fs-xs);
    font-weight: 600;
    padding: 3px 10px;
    border-radius: var(--radius-pill);
    background: var(--danger-soft);
}
</style>
