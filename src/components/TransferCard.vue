<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const tabs = ['Внутренние переводы', 'Межбиржевые переводы', 'Обмен на споте']
const activeTab = ref(0)
const amount = ref('')
const percents = ['10%', '25%', '50%', '75%', '100%']
</script>

<template>
  <section class="card transfer">
    <div class="tabs">
      <button v-for="(t, i) in tabs" :key="t" class="tab" :class="{ 'tab--active': i === activeTab }" @click="activeTab = i">
        {{ t }} <Icon v-if="i === 0" name="info" :size="14" />
      </button>
    </div>

    <div class="transfer__body">
      <div class="accounts">
        <div class="account">
          <div class="account__label">Со счета</div>
          <div class="account__name">Спотовый счет</div>
          <div class="account__balance">0.00 USDT <a href="#">Пополнить</a></div>
        </div>
        <button class="swap"><Icon name="swap" :size="18" /></button>
        <div class="account">
          <div class="account__label">На счет</div>
          <div class="account__name">Фьючерсный счет</div>
          <div class="account__balance">566.76476969 USDT</div>
        </div>
      </div>

      <div class="form">
        <div class="form__row">
          <div class="input">
            <input v-model="amount" placeholder="Сумма" />
            <button class="coin-select">
              <span class="coin-dot"></span> USDT <Icon name="chevron" :size="16" />
            </button>
          </div>
          <button class="btn-transfer" :disabled="!amount">Перевести</button>
        </div>
        <div class="form__hint">Без комиссии</div>
        <div class="percents">
          <button v-for="p in percents" :key="p" class="chip">{{ p }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transfer { padding: var(--space-5); flex: 1; }
.tabs { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); }
.tab { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: var(--radius-pill); background: var(--bg-elevated); font-size: var(--fs-md); color: var(--text-secondary); }
.tab--active { background: var(--accent); color: #fff; }

.transfer__body { display: flex; gap: var(--space-6); align-items: flex-start; }
.accounts { display: flex; gap: var(--space-6); align-items: center; flex: 1; }
.account { min-width: 0; }
.account__label { font-size: var(--fs-sm); color: var(--text-secondary); }
.account__name { font-size: var(--fs-xl); font-weight: 600; margin: 6px 0 8px; }
.account__balance { font-size: var(--fs-lg); color: var(--text-secondary); }
.account__balance a { margin-left: 6px; }
.swap { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-elevated); display: grid; place-items: center; }

.form { width: 590px; flex-shrink: 0; }
.form__row { display: flex; gap: var(--space-3); }
.input { flex: 1; display: flex; align-items: center; background: var(--bg-elevated); border-radius: var(--radius-sm); height: 36px; }
.input input { flex: 1; background: none; border: 0; outline: none; padding: 0 10px; font-size: var(--fs-lg); }
.input input::placeholder { color: var(--text-placeholder); }
.coin-select { display: flex; align-items: center; gap: 8px; height: 100%; padding: 0 12px; border-radius: var(--radius-sm); background: #2a2a35; font-size: var(--fs-lg); }
.coin-dot { width: 16px; height: 16px; border-radius: 50%; background: #26a17b; }
.btn-transfer { background: var(--accent); color: #fff; padding: 0 10px; border-radius: var(--radius-sm); font-size: var(--fs-lg); }
.btn-transfer:disabled { background: var(--accent-muted); color: #c5d4ee; cursor: default; }
.form__hint { font-size: var(--fs-xs); color: var(--text-muted); margin: 6px 0 var(--space-3); }
.percents { display: flex; gap: var(--space-2); }
.chip { padding: 4px 9px; border-radius: var(--radius-pill); background: var(--bg-elevated); color: var(--text-secondary); font-size: var(--fs-md); }
.chip:hover { background: var(--bg-elevated-hover); }
</style>
