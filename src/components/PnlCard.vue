<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import SkyPeek from './SkyPeek.vue'
import Tooltip from './Tooltip.vue'
import PnlPresetModal from './PnlPresetModal.vue'
import PnlShareModal from './PnlShareModal.vue'
import { pnl } from '../data/mock.js'

// Для проверки можно подставить своё число: ?pnl=-42.5
const value = new URLSearchParams(location.search).get('pnl') ?? pnl.value
// Отрицательный PnL: красные число (и рамка со свечением в пресете «Акцент»)
const isUp = computed(() => !String(value).trim().startsWith('-'))

const pnlHint =
  'Виджет показывает чистый PnL за сутки. Обновляется при фиксации финреза (закрыта позиция или часть), ' +
  'списании комиссии, фандинга и пр. Результат сбрасывается при нажатии на кнопку со стрелкой'

/* ---------- Пресет виджета: 'minimal' | 'gradient' | 'accent', запоминается в браузере ---------- */
const STORAGE_KEY = 'vataga.pnlPreset'
function readPreset() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'accent'
  } catch {
    return 'accent'
  }
}
const preset = ref(readPreset())
watch(preset, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {
    /* приватный режим и т.п. — просто не запоминаем */
  }
})

/* ---------- Меню «⋯» и модалка ---------- */
const menuOpen = ref(false)
const modalOpen = ref(false)
const menuRoot = ref(null)

const shareOpen = ref(false)
const toNum = (v) => Number(String(v).replace(/\s/g, '').replace('−', '-')) || 0

function openShare() {
  menuOpen.value = false
  shareOpen.value = true
}
function resetPnl() {
  // «Сбросить» — по договорённости без логики, только закрываем меню
  menuOpen.value = false
}
function openPresetModal() {
  menuOpen.value = false
  modalOpen.value = true
}
function onDocClick(e) {
  if (menuOpen.value && menuRoot.value && !menuRoot.value.contains(e.target)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <section class="card pnl" :class="['pnl--' + preset, isUp ? 'pnl--up' : 'pnl--down']">
    <SkyPeek v-if="preset === 'accent'" />
    <div class="pnl__head">
      <span class="pnl__title">
        Суточный PnL, USDT
        <Tooltip :text="pnlHint"><Icon name="info" :size="15" /></Tooltip>
      </span>
      <div ref="menuRoot" class="menu-wrap">
        <button class="pnl__more" :class="{ 'pnl__more--on': menuOpen }" aria-label="Ещё" @click="menuOpen = !menuOpen">
          <Icon name="more" :size="20" />
        </button>
        <Transition name="pop">
          <div v-if="menuOpen" class="menu" role="menu">
            <button class="menu__item" role="menuitem" @click="resetPnl">
              <Icon name="reset" :size="16" /> Сбросить
            </button>
            <button class="menu__item" role="menuitem" @click="openPresetModal">
              <Icon name="palette" :size="16" /> Сменить пресет
            </button>
          </div>
        </Transition>
      </div>
    </div>
    <div class="pnl__body">
      <div class="pnl__value" :class="isUp ? 'pos' : 'neg'">{{ isUp ? '+' : '' }}{{ value }}</div>
      <div class="pnl__unr neg">{{ pnl.unrealized }} Unr.</div>
    </div>

    <!-- «Поделиться»: всегда на виду, правый нижний угол -->
    <div class="share-wrap">
      <Tooltip text="Поделиться">
        <button class="share-btn" aria-label="Поделиться" @click="openShare">
          <Icon name="share" :size="16" />
        </button>
      </Tooltip>
    </div>

    <!-- Модалка телепортируется в body, здесь только чтобы у компонента был один корень -->
    <PnlPresetModal v-model="preset" :open="modalOpen" @close="modalOpen = false" />
    <PnlShareModal :open="shareOpen" :realized="toNum(value)" :unrealized="toNum(pnl.unrealized)" @close="shareOpen = false" />
  </section>
</template>

<style scoped>
/* ================= Общее для обоих пресетов ================= */
.pnl {
    position: relative;
    display: flex;
    flex-direction: column;
}
.pnl__head,
.pnl__body {
    position: relative;
    z-index: 1; /* поверх солнца/луны */
}
.pnl__head {
    z-index: 2; /* меню поверх числа */
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

.menu-wrap {
    position: relative;
}
.pnl__more {
    color: var(--text-muted);
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: var(--radius-sm);
    transition: background 0.15s, color 0.15s;
}
.pnl__more :deep(svg) {
    display: block;
}
.pnl__more:hover,
.pnl__more--on {
    background: var(--bg-elevated);
    color: var(--text-primary);
}
.menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 190px;
    padding: 4px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-pop);
}
.menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 34px;
    padding: 0 10px;
    border-radius: 6px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    white-space: nowrap;
}
.menu__item :deep(svg) {
    color: var(--text-muted);
}
/* Кнопка «Поделиться» в правом нижнем углу: квадрат с обводкой */
.share-wrap {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 2;
}
.pnl--minimal .share-wrap {
    right: 0;
    bottom: 0;
}
.share-btn {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.share-btn :deep(svg) {
    display: block;
}
.share-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--text-muted);
    color: var(--text-primary);
}
.menu__item:hover {
    background: var(--bg-elevated-hover);
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

.pnl__value {
    font-weight: 700;
}
.pnl__unr {
    font-size: var(--fs-xs);
    font-weight: 600;
    background: var(--danger-soft);
}

/* ================= Пресет «Минимал»: без карточки ================= */
.pnl--minimal {
    padding: 0;
    background: none;
    border: 0;
    box-shadow: none;
    border-radius: 0;
}
.pnl--minimal .pnl__value {
    font-size: 36px; /* +20% к --fs-pnl (30px) */
    letter-spacing: -0.02em;
    margin-top: 10px;
}
.pnl--minimal .pnl__unr {
    font-size: 13px; /* +20% к --fs-xs (11px) */
    align-self: flex-start;
    margin-top: 6px;
    padding: 3px 8px;
    border-radius: 6px;
}
.pnl--minimal .pnl__body {
    display: flex;
    flex-direction: column;
}

/* ================= Пресет «Градиент»: как «Минимал», но с цветным фоном из правого нижнего угла ================= */
.pnl--gradient {
    --pnl-tint: rgba(31, 199, 126, 0.22);
    padding: var(--space-4) var(--card-padding);
    border: 0;
    box-shadow: none;
    border-radius: var(--radius-lg);
    background: linear-gradient(to top left, var(--pnl-tint) 0%, transparent 70%);
}
.pnl--gradient.pnl--down {
    --pnl-tint: rgba(242, 73, 92, 0.22);
}
.pnl--gradient .pnl__body {
    display: flex;
    flex-direction: column;
}
.pnl--gradient .pnl__value {
    font-size: var(--fs-pnl);
    letter-spacing: -0.02em;
    margin-top: 10px;
}
.pnl--gradient .pnl__unr {
    align-self: flex-start;
    margin-top: 6px;
    padding: 3px 8px;
    border-radius: 6px;
}

/* ================= Пресет «Акцент»: рамка, свечение, солнце/луна ================= */
.pnl--accent {
    --pnl-color: var(--success);
    --pnl-glow: rgba(31, 199, 126, 0.16);
    --pnl-border: rgba(31, 199, 126, 0.35);
    padding: var(--space-4) var(--card-padding);
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
.pnl--accent.pnl--down {
    --pnl-color: var(--danger);
    --pnl-glow: rgba(242, 73, 92, 0.16);
    --pnl-border: rgba(242, 73, 92, 0.35);
}
/* Тонкая светящаяся полоска сверху */
.pnl--accent::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--pnl-color), transparent);
    opacity: 0.8;
}
/* Число по центру карточки */
.pnl--accent .pnl__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 0 32px; /* место под выглядывающее светило */
}
.pnl--accent .pnl__value {
    font-size: 44px;
    line-height: 1;
    letter-spacing: -0.03em;
    text-shadow: 0 0 24px var(--pnl-glow);
}
.pnl--accent .pnl__unr {
    padding: 3px 10px;
    border-radius: var(--radius-pill);
}
</style>
