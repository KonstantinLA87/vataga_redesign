<script setup>
// Общая таблица для «Открытые позиции» и «Заявки».
// columns: [{ key, label, sortable }]; ячейки можно переопределить слотом #cell-<key>.
import Icon from './Icon.vue'
defineProps({
  title: String,
  actionLabel: String,
  rowActionLabel: String,
  columns: Array,
  rows: Array,
})
</script>

<template>
  <section class="card table-card">
    <div class="table-card__head">
      <h3>{{ title }}</h3>
      <button class="btn-primary">{{ actionLabel }}</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key">
            {{ c.label }} <Icon name="sort" :size="11" class="sort" />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td v-for="c in columns" :key="c.key">
            <slot :name="'cell-' + c.key" :row="r">{{ r[c.key] }}</slot>
          </td>
          <td class="actions"><button class="btn-ghost">{{ rowActionLabel }}</button></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.table-card {
    padding: var(--space-5) 0 var(--space-2);
    overflow: hidden;
}
.table-card__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-5);
    margin-bottom: var(--space-4);
}
.table-card__head h3 {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: 600;
}
.table {
    width: 100%;
    border-collapse: collapse;
}
th {
    text-align: left;
    font-weight: 600;
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    padding: 10px;
    white-space: nowrap;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.015);
}
th:first-child,
td:first-child {
    padding-left: var(--space-5);
}
th:last-child,
td:last-child {
    padding-right: var(--space-5);
}
.sort {
    vertical-align: middle;
    opacity: 0.5;
}
td {
    padding: 10px;
    font-size: var(--fs-sm);
    white-space: nowrap;
    height: 52px;
    border-bottom: 1px solid var(--border);
}
tbody tr:last-child td {
    border-bottom: 0;
}
tbody tr {
    transition: background 0.12s;
}
tbody tr:hover {
    background: var(--bg-row-hover);
}
.actions {
    text-align: right;
}
</style>
