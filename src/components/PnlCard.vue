<script setup>
import Icon from './Icon.vue'
import { pnl } from '../data/mock.js'
</script>

<template>
  <section class="card pnl">
    <div class="pnl__head">
      <span class="pnl__title">Суточный PnL, USDT <Icon name="info" :size="15" /></span>
      <button class="pnl__more"><Icon name="more" :size="24" /></button>
    </div>
    <div class="pnl__value pos">{{ pnl.value }}</div>
    <div class="pnl__unr neg">{{ pnl.unrealized }} Unr.</div>
  </section>
</template>

<style scoped>
.pnl {
    /* Без карточки: просто текст на фоне страницы */
    padding: 0;
    background: none;
    border: 0;
    box-shadow: none;
    border-radius: 0;
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
.pnl__value {
    font-size: var(--fs-pnl);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 10px;
}
.pnl__unr {
    display: inline-block;
    margin-top: 6px;
    font-size: var(--fs-xs);
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    background: var(--danger-soft);
}
</style>
