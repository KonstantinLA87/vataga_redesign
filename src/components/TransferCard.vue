<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { coinIcon, hideBrokenIcon } from '../utils/coinIcon.js'
import binanceIcon from '../assets/img/binance-link.svg'
import bybitIcon from '../assets/img/bybit-uta.svg'

const tabs = ['Внутренние переводы', 'Межбиржевые переводы', 'Обмен на споте']
const activeTab = ref(0)
const amount = ref('')
const percents = ['10%', '25%', '50%', '75%', '100%']

// ===== Межбиржевые переводы: счета бирж (тестовые данные) =====
const xAccounts = [
  { id: 'bn-spot', icon: binanceIcon, label: 'Спот Binance Link', balance: '0.00' },
  { id: 'bn-fut', icon: binanceIcon, label: 'Фьючерсы Binance Link', balance: '566.76' },
  { id: 'bb-uni', icon: bybitIcon, label: 'Bybit Unified', balance: '0.00' },
]
// ===== Внутренние переводы: спот ⇄ фьючерсы =====
const intAccounts = {
  spot: { id: 'spot', icon: 'coins', label: 'Спотовый счет', balance: '0.00' },
  fut: { id: 'fut', icon: 'percent', label: 'Фьючерсный счет', balance: '566.76476969' },
}
const intOrder = ref(['spot', 'fut'])
const intPair = computed(() => intOrder.value.map((id) => intAccounts[id]))
const swapInt = () => intOrder.value.reverse()

// ===== Обмен на споте (тестовые цены и балансы) =====
const spotCoins = ['USDT', 'BTC', 'BNB', '0G', '1000CAT', '1000CHEEMS']
const prices = { USDT: 1, BTC: 97000, BNB: 610, '0G': 1.2, '1000CAT': 0.04, '1000CHEEMS': 0.0015 }
const balances = { USDT: '125.40' }
const available = (c) => balances[c] || '0.00'
const giveCoin = ref('USDT')
const getCoin = ref('BTC')
const giveAmount = ref('')
const fmt = (n) => (n >= 1 ? n.toFixed(4) : n.toPrecision(4)).replace(/\.?0+$/, '')
const rate = computed(() => fmt(prices[giveCoin.value] / prices[getCoin.value]))
const getAmount = computed(() => {
  const v = Number(String(giveAmount.value).replace(',', '.'))
  return v > 0 ? fmt((v * prices[giveCoin.value] * 0.999) / prices[getCoin.value]) : ''
})
function pickCoin(side, c) {
  // Та же монета, что на другой стороне, — меняем местами
  const other = side === 'give' ? getCoin : giveCoin
  const self = side === 'give' ? giveCoin : getCoin
  if (other.value === c) other.value = self.value
  self.value = c
  openSelect.value = null
}
function swapCoins() {
  ;[giveCoin.value, getCoin.value] = [getCoin.value, giveCoin.value]
  giveAmount.value = ''
}
function setGivePercent(p) {
  const v = (Number(available(giveCoin.value)) * parseInt(p)) / 100
  giveAmount.value = v ? fmt(v) : ''
}

const fromId = ref('bn-spot')
const toId = ref('bb-uni')
const fromAcc = computed(() => xAccounts.find((a) => a.id === fromId.value))
const toAcc = computed(() => xAccounts.find((a) => a.id === toId.value))
const openSelect = ref(null) // null | 'from' | 'to' | 'give' | 'get'

function pick(side, id) {
  // Выбрали тот же счёт, что на другой стороне, — меняем их местами
  if (side === 'from') {
    if (id === toId.value) toId.value = fromId.value
    fromId.value = id
  } else {
    if (id === fromId.value) fromId.value = toId.value
    toId.value = id
  }
  openSelect.value = null
}
function swapX() {
  ;[fromId.value, toId.value] = [toId.value, fromId.value]
}
const onDocClick = (e) => {
  if (openSelect.value && !e.target.closest('.xsel')) openSelect.value = null
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <section class="card transfer">
    <div class="tabs">
      <button v-for="(t, i) in tabs" :key="t" class="tab" :class="{ 'tab--active': i === activeTab }" @click="activeTab = i">
        {{ t }} <Icon v-if="i === 0" name="info" :size="14" />
      </button>
    </div>

    <div class="transfer__body" :class="['transfer__body--int', 'transfer__body--x', 'transfer__body--swap'][activeTab]">
      <!-- Межбиржевые: два селекта бирж -->
      <div v-if="activeTab === 1" class="accounts accounts--x">
        <template v-for="side in ['from', 'to']" :key="side">
          <div class="xside">
          <div class="xsel">
            <button
              class="xsel__btn"
              :class="{ 'xsel__btn--on': openSelect === side }"
              @click="openSelect = openSelect === side ? null : side"
            >
              <img class="xsel__icon" :src="(side === 'from' ? fromAcc : toAcc).icon" alt="" />
              <span class="xsel__text">
                <span class="xsel__name" :title="(side === 'from' ? fromAcc : toAcc).label">{{ (side === 'from' ? fromAcc : toAcc).label }}</span>
                <span class="xsel__bal">{{ (side === 'from' ? fromAcc : toAcc).balance }} USDT</span>
              </span>
              <Icon name="chevron" :size="14" class="xsel__chev" />
            </button>
            <Transition name="pop">
              <div v-if="openSelect === side" class="xsel__menu" role="listbox">
                <button
                  v-for="a in xAccounts"
                  :key="a.id"
                  class="xsel__opt"
                  :class="{ 'xsel__opt--on': a.id === (side === 'from' ? fromId : toId) }"
                  role="option"
                  @click="pick(side, a.id)"
                >
                  <img class="xsel__icon xsel__icon--sm" :src="a.icon" alt="" />
                  <span class="xsel__opt-name">{{ a.label }}</span>
                  <span class="xsel__opt-bal">{{ a.balance }}</span>
                </button>
              </div>
            </Transition>
          </div>
          <div class="account__label account__label--under">{{ side === 'from' ? 'Со счета' : 'На счет' }}</div>
          </div>
          <button v-if="side === 'from'" class="swap" aria-label="Поменять местами" @click="swapX"><Icon name="swap" :size="18" /></button>
        </template>
      </div>

      <!-- Внутренние: те же плашки, подписи «Со счета / На счет» под ними -->
      <!-- Обмен на споте: «Отдаёте» → «Получаете» -->
      <div v-else-if="activeTab === 2" class="accounts accounts--x">
        <template v-for="side in ['give', 'get']" :key="side">
          <div class="xside">
            <div class="xsel">
              <div class="xfield" :class="{ 'xfield--on': openSelect === side }">
                <input
                  v-if="side === 'give'"
                  v-model="giveAmount"
                  class="xfield__input"
                  placeholder="0.00"
                  inputmode="decimal"
                />
                <span v-else class="xfield__input xfield__out" :class="{ 'xfield__out--empty': !getAmount }">{{ getAmount || '0.00' }}</span>
                <button v-if="side === 'give'" class="xfield__max" @click="giveAmount = available(giveCoin)">Макс</button>
                <button class="xfield__coin" @click="openSelect = openSelect === side ? null : side">
                  <span class="coin-dot"><img :src="coinIcon(side === 'give' ? giveCoin : getCoin)" alt="" @error="hideBrokenIcon" /></span>
                  {{ side === 'give' ? giveCoin : getCoin }}
                  <Icon name="chevron" :size="14" class="xsel__chev" />
                </button>
              </div>
              <Transition name="pop">
                <div v-if="openSelect === side" class="xsel__menu xsel__menu--right" role="listbox">
                  <button
                    v-for="c in spotCoins"
                    :key="c"
                    class="xsel__opt"
                    :class="{ 'xsel__opt--on': c === (side === 'give' ? giveCoin : getCoin) }"
                    role="option"
                    @click="pickCoin(side, c)"
                  >
                    <span class="coin-dot"><img :src="coinIcon(c)" alt="" @error="hideBrokenIcon" /></span>
                    <span class="xsel__opt-name">{{ c }}</span>
                    <span class="xsel__opt-bal">{{ available(c) }}</span>
                  </button>
                </div>
              </Transition>
            </div>
            <div class="xnote">
              <template v-if="side === 'give'">Доступно: {{ available(giveCoin) }} {{ giveCoin }}</template>
              <template v-else>1 {{ giveCoin }} ≈ {{ rate }} {{ getCoin }}</template>
            </div>
          </div>
          <button v-if="side === 'give'" class="swap" aria-label="Поменять монеты местами" @click="swapCoins"><Icon name="swap" :size="18" /></button>
        </template>
      </div>

      <div v-else class="accounts accounts--x accounts--int">
        <template v-for="(acc, i) in intPair" :key="acc.id">
          <div class="xside">
            <div class="xsel__btn xsel__btn--static">
              <span class="int-icon"><Icon :name="acc.icon" :size="14" /></span>
              <span class="xsel__text">
                <span class="xsel__name">{{ acc.label }}</span>
                <span class="xsel__bal">
                  {{ acc.balance }} USDT
                  <a v-if="acc.id === 'spot'" href="#" class="int-topup">Пополнить</a>
                </span>
              </span>
            </div>
            <div class="account__label account__label--under">{{ i === 0 ? 'Со счета' : 'На счет' }}</div>
          </div>
          <button v-if="i === 0" class="swap" aria-label="Поменять местами" @click="swapInt"><Icon name="swap" :size="18" /></button>
        </template>
      </div>

      <!-- Обмен на споте: справа кнопка предпросмотра -->
      <div v-if="activeTab === 2" class="form">
        <button class="btn-transfer btn-preview" :disabled="!Number(giveAmount)">Предпросмотр сделки</button>
        <div class="form__hint form__hint--fee">Комиссия биржи: 0.1%</div>
        <div class="percents">
          <button v-for="p in percents" :key="p" class="chip" @click="setGivePercent(p)">{{ p }}</button>
        </div>
      </div>

      <div v-else class="form">
        <div class="form__row">
          <div class="input">
            <input v-model="amount" :placeholder="activeTab === 1 ? 'Минимальная сумма: 3.01 USDT' : 'Сумма'" />
            <button class="coin-select">
              <span class="coin-dot"><img :src="coinIcon('USDT')" alt="USDT" @error="hideBrokenIcon" /></span> USDT <Icon name="chevron" :size="16" />
            </button>
          </div>
          <button class="btn-transfer" :disabled="!amount">Перевести</button>
        </div>
        <div v-if="activeTab === 1" class="form__hint form__hint--fee">Комиссия: 0.01 USDT</div>
        <div v-else class="form__hint">Без комиссии</div>
        <div class="percents">
          <button v-for="p in percents" :key="p" class="chip">{{ p }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transfer {
    --plate-h: 62px; /* высота плашек счетов и полей обмена */
    padding: var(--card-padding);
    flex: 1;
    min-width: 0; /* не вылезать за край экрана на узких мониторах */
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
    flex-wrap: wrap; /* если не помещается в строку, форма уходит под счета */
    gap: var(--space-4) var(--space-5);
    align-items: flex-start;
}
.accounts {
    display: flex;
    gap: var(--space-4);
    align-items: center;
}
/* Плашка делится на две равные половины: счета слева, форма справа.
   Если половинам тесно, форма уходит вниз на всю ширину */
.accounts,
.form {
    flex: 1 1 var(--half-min, 360px);
}
.transfer__body--x {
    --half-min: 440px;
}
/* Обмен на споте: не делим пополам. Справа блок «Предпросмотр сделки» шириной по содержимому,
   прибит к правому краю; слева поля обмена занимают всё оставшееся место */
.transfer__body--swap .accounts {
    flex: 1 1 480px;
}
.transfer__body--swap .form {
    flex: 0 0 auto;
    margin-left: auto;
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

/* Поле суммы ужимается не меньше 280px */
.input {
    min-width: 280px;
}
.account__name {
    white-space: nowrap;
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
    width: 0;
    min-width: 0;
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
    overflow: hidden;
    flex-shrink: 0;
}
.coin-dot img {
    display: block;
    width: 100%;
    height: 100%;
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

/* ===== Межбиржевые переводы ===== */
.accounts--x {
    gap: var(--space-2);
    align-items: flex-start; /* подписи под плашками, выравниваем по верху */
}
.xside {
    flex: 1;
    min-width: 0;
}
.accounts--x .swap {
    margin-top: calc((var(--plate-h) - 32px) / 2); /* по центру плашки */
}
.account__label--under {
    margin-top: 6px;
}
.xsel__btn--static {
    cursor: default;
}
.xsel__btn--static:hover {
    border-color: var(--border-strong);
}
.int-icon {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    margin-right: 2px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent-hover);
    flex-shrink: 0;
}
.int-topup {
    margin-left: 6px;
    font-weight: 600;
}
.xsel {
    position: relative;
    flex: 1;
    min-width: 0;
}
.xsel__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    height: var(--plate-h);
    padding: 0 10px;
    text-align: left;
    background: var(--bg-page);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    transition: border-color 0.15s;
}
.xsel__btn:hover,
.xsel__btn--on {
    border-color: var(--accent-muted);
}
.xsel__icon {
    display: block;
    width: 22px;
    height: 22px;
    margin-right: 2px;
    flex-shrink: 0;
}
.xsel__icon--sm {
    width: 18px;
    height: 18px;
}
.xsel__text {
    display: flex;
    flex-direction: column;
    gap: 4px; /* было 2px */
    min-width: 0;
    flex: 1;
}
.xsel__name {
    font-size: var(--fs-md);
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.xsel__bal {
    font-size: 12px; /* на 1px крупнее --fs-xs */
    color: var(--text-muted);
}
.xsel__chev {
    color: var(--text-muted);
    flex-shrink: 0;
    transition: transform 0.15s;
}
.xsel__btn--on .xsel__chev {
    transform: rotate(180deg);
}
.xsel__menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    padding: 4px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-pop);
    z-index: 5;
}
.xsel__opt {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 36px;
    padding: 0 10px;
    border-radius: 6px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    text-align: left;
}
.xsel__opt:hover {
    background: var(--bg-elevated-hover);
}
.xsel__opt--on {
    background: var(--bg-nav-active);
}
.xsel__opt-name {
    flex: 1;
    white-space: nowrap;
}
/* В межбиржевых форма чуть уже, чтобы названия бирж помещались целиком */
.accounts--x .swap {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
}
.xsel__menu {
    min-width: 260px;
}
.xsel__opt-bal {
    font-size: var(--fs-xs);
    color: var(--text-muted);
}
.form__hint--fee {
    color: var(--text-muted);
}
.pop-enter-active,
.pop-leave-active {
    transition: opacity 0.12s, transform 0.12s;
}
.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* ===== Обмен на споте ===== */
.xfield {
    display: flex;
    align-items: center;
    gap: 6px;
    height: var(--plate-h);
    padding: 0 8px 0 12px;
    background: var(--bg-page);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    transition: border-color 0.15s;
}
.xfield:focus-within,
.xfield--on {
    border-color: var(--accent-muted);
}
.xfield__input {
    flex: 1;
    width: 0;
    min-width: 0;
    background: none;
    border: 0;
    outline: none;
    font-size: var(--fs-xl);
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.xfield__input::placeholder,
.xfield__out--empty {
    color: var(--text-placeholder);
}
.xfield__max {
    font-size: var(--fs-xs);
    font-weight: 600;
    color: var(--accent-hover);
    padding: 4px 6px;
    border-radius: 6px;
}
.xfield__max:hover {
    background: var(--accent-soft);
}
.xfield__coin {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 8px;
    border-radius: 6px;
    background: var(--bg-elevated);
    font-size: var(--fs-sm);
    font-weight: 600;
    flex-shrink: 0;
}
.xfield__coin:hover {
    background: var(--bg-elevated-hover);
}
.xsel__menu--right {
    left: auto;
    min-width: 220px;
}
.xnote {
    margin-top: 6px;
    font-size: var(--fs-xs);
    color: var(--text-muted);
}
</style>
