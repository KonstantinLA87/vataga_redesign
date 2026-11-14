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
.transfer {
    padding: var(--card-padding);
    flex: 1;
}

/* Табы как сегментированный переключатель */
.tabs {
    display: inline-flex;
    gap: 2px;
    padding: 3px;
    margin-bottom: var(--space-4);
    background: var(--bg-page);
    border: 1px solid var(--border);
    border-radius: 10px;
}
.tab {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    border-radius: 7px;
    font-size: var(--fs-sm);
    font-weight: 500;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
}
.tab:hover {
    color: var(--text-primary);
}
.tab--active {
    background: var(--bg-elevated);
    color: var(--text-primary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.transfer__body {
    display: flex;
    gap: var(--space-6);
    align-items: flex-start;
}
.accounts {
    display: flex;
    gap: var(--space-5);
    align-items: center;
    flex: 1;
}
.account {
    min-width: 0;
}
.account__label {
    font-size: var(--fs-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
}
.account__name {
    font-size: var(--fs-xl);
    font-weight: 600;
    margin: 6px 0 6px;
}
.account__balance {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
}
.account__balance a {
    margin-left: 8px;
    font-weight: 600;
}
.swap {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border-strong);
    color: var(--text-secondary);
    display: grid;
    place-items: center;
    transition: background 0.15s, color 0.15s, transform 0.2s;
}
.swap:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
    transform: rotate(180deg);
}

.form {
    width: 560px;
    flex-shrink: 0;
}
.form__row {
    display: flex;
    gap: var(--space-2);
}
.input {
    flex: 1;
    display: flex;
    align-items: center;
    background: var(--bg-page);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    height: 40px;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus-within {
    border-color: #873efe78;
}
.input input {
    flex: 1;
    background: none;
    border: 0;
    outline: none;
    padding: 0 12px;
    font-size: var(--fs-md);
}
.input input::placeholder {
    color: var(--text-placeholder);
}
.coin-select {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    margin-right: 4px;
    padding: 0 10px;
    border-radius: 6px;
    background: var(--bg-elevated);
    font-size: var(--fs-sm);
    font-weight: 600;
}
.coin-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #26a17b;
}
.btn-transfer {
    background: var(--accent);
    color: #fff;
    height: 40px;
    padding: 0 18px;
    border-radius: var(--radius-sm);
    font-size: var(--fs-sm);
    font-weight: 600;
    transition: background 0.15s;
}
.btn-transfer:hover:not(:disabled) {
    background: var(--accent-hover);
}
.btn-transfer:disabled {
    background: var(--bg-elevated);
    color: var(--text-muted);
    cursor: default;
}
.form__hint {
    font-size: var(--fs-xs);
    color: var(--success-text);
    margin: 8px 0 var(--space-3);
}
.percents {
    display: flex;
    gap: 6px;
}
.chip {
    height: 28px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--border-strong);
    color: var(--text-secondary);
    font-size: var(--fs-xs);
    font-weight: 600;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.chip:hover {
    background: var(--accent-soft);
    border-color: var(--accent-muted);
    color: var(--text-primary);
}
</style>
