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
.pnl { padding: var(--space-5); }
.pnl__head { display: flex; justify-content: space-between; align-items: center; }
.pnl__title { display: flex; align-items: center; gap: 5px; font-weight: 600; font-size: var(--fs-lg); }
.pnl__more { color: var(--text-primary); display: flex; }
.pnl__value { font-size: var(--fs-pnl); font-weight: 600; margin-top: 6px; }
.pnl__unr { font-size: var(--fs-md); }
</style>
