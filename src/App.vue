<script setup>
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import PnlCard from './components/PnlCard.vue'
import TransferCard from './components/TransferCard.vue'
import DataTable from './components/DataTable.vue'
import Icon from './components/Icon.vue'
import { positions, orders } from './data/mock.js'

const positionColumns = [
  { key: 'symbol', label: 'Инструмент' },
  { key: 'side', label: 'Направление' },
  { key: 'mode', label: 'Режим маржи' },
  { key: 'margin', label: 'Размер маржи' },
  { key: 'size', label: 'Объем' },
  { key: 'entry', label: 'Цена входа' },
  { key: 'last', label: 'Последняя цена' },
  { key: 'liq', label: 'Цена ликвидации' },
  { key: 'pnl', label: 'PnL' },
]
const orderColumns = [
  { key: 'created', label: 'Создано' },
  { key: 'symbol', label: 'Инструмент' },
  { key: 'type', label: 'Тип' },
  { key: 'side', label: 'Направление' },
  { key: 'mode', label: 'Режим маржи' },
  { key: 'price', label: 'Цена' },
  { key: 'stop', label: 'Стоп-цена' },
  { key: 'size', label: 'Объем' },
]
</script>

<template>
  <AppHeader />
  <div class="layout">
    <AppSidebar />

    <main class="content">
      <div class="top-row">
        <PnlCard class="top-row__pnl" />
        <TransferCard />
      </div>

      <div class="section-head">
        <h2>Фьючерсная торговля</h2>
        <button class="deals"><Icon name="list" :size="18" /> Сделки</button>
      </div>

      <DataTable title="Открытые позиции" action-label="Закрыть все" row-action-label="Закрыть"
                 :columns="positionColumns" :rows="positions">
        <template #cell-symbol="{ row }">
          {{ row.symbol }} <span class="badge badge--lev">{{ row.lev }}</span>
        </template>
        <template #cell-side="{ row }">
          <span class="badge" :class="row.side === 'Long' ? 'badge--long' : 'badge--short'">{{ row.side }}</span>
        </template>
        <template #cell-pnl="{ row }">
          <span :class="row.pnl.startsWith('-') ? 'neg' : 'pos'">{{ row.pnl }}</span>
        </template>
      </DataTable>

      <DataTable title="Заявки" action-label="Снять все" row-action-label="Снять"
                 :columns="orderColumns" :rows="orders">
        <template #cell-side="{ row }">
          <span class="badge badge--sell">{{ row.side }}</span>
        </template>
      </DataTable>
    </main>
  </div>
</template>

<style scoped>
.layout {
    display: flex;
    gap: var(--space-6);
}
.content {
    flex: 1;
    min-width: 0;
    padding: 28px var(--space-6) var(--space-6) 8px;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}
.top-row {
    display: flex;
    gap: var(--space-4);
}
.top-row__pnl {
    width: 320px;
    flex-shrink: 0;
}
.section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 0;
}
.section-head h2 {
    margin: 0;
    font-size: var(--fs-xl);
    font-weight: 700;
    letter-spacing: -0.01em;
}
.deals {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
}
.deals:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}
</style>
