<script setup>
import Icon from "./Icon.vue";
import { exchanges, futuresBalances, spotBalances, navItems } from "../data/mock.js";
import { coinIcon, hideBrokenIcon } from "../utils/coinIcon.js";
import binanceIcon from "../assets/img/binance-link.svg";
import bybitIcon from "../assets/img/bybit-uta.svg";

// Иконки бирж по ключу icon из mock.js
const exchangeIcons = { binance: binanceIcon, bybit: bybitIcon };
</script>

<template>
    <aside class="sidebar">
        <!-- Промо-баннер -->
        <div class="promo">
            <button class="promo__close"><Icon name="close" :size="12" /></button>
            <div class="promo__title">🏆 Vataga Crypto × OKX</div>
            <div class="promo__text">Поборись за призовое место!</div>
            <a href="#" class="promo__link">Регистрация открыта →</a>
            <div class="promo__okx">OKX</div>
        </div>

        <!-- Биржи -->
        <div class="side-card">
            <button v-for="e in exchanges" :key="e.name" class="exchange" :class="{ 'exchange--active': e.active }">
                <img class="exchange__icon" :src="exchangeIcons[e.icon]" alt="" />
                {{ e.name }}
            </button>
        </div>

        <div class="side-card">
            <button class="add-btn"><Icon name="plus" :size="18" /> OKX Affiliate</button>
        </div>

        <!-- Балансы -->
        <div class="side-card side-card--flush">
            <div class="balances">
                <div class="balances__title">Фьючерсный счет</div>
                <div v-for="b in futuresBalances" :key="b.coin" class="balance">
                    <span class="coin" :style="{ background: b.color }"><img :src="coinIcon(b.coin)" :alt="b.coin" @error="hideBrokenIcon" /></span>
                    <span class="balance__amount">{{ b.amount }}</span>
                    <span class="balance__coin">{{ b.coin }}</span>
                </div>
            </div>
            <div class="balances balances--divided">
                <div class="balances__title">Спотовый счет</div>
                <div v-for="b in spotBalances" :key="b.coin" class="balance">
                    <span class="coin" :style="{ background: b.color }"><img :src="coinIcon(b.coin)" :alt="b.coin" @error="hideBrokenIcon" /></span>
                    <span class="balance__amount">{{ b.amount }}</span>
                    <span class="balance__coin">{{ b.coin }}</span>
                </div>
                <a href="#" class="all-link">Все валюты</a>
            </div>
        </div>

        <!-- Меню -->
        <nav class="menu">
            <a v-for="n in navItems" :key="n.label" href="#" class="menu__item" :class="{ 'menu__item--active': n.active }">
                <Icon :name="n.icon" :size="20" />
                {{ n.label }}
            </a>
        </nav>

        <!-- Подписка -->
        <div class="side-card subscribe">
            <div class="subscribe__title">Подпишитесь!</div>
            <div class="subscribe__text">Узнавайте первыми о свежих фичах и новостях проекта</div>
            <a href="#" class="social-btn"><Icon name="telegram" :size="18" /> Telegram</a>
            <a href="#" class="social-btn"><Icon name="discord" :size="18" /> Discord</a>
        </div>

        <a href="#" class="menu__item logout"><Icon name="logout" :size="20" /> Выйти</a>
    </aside>
</template>

<style scoped>
.sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: 28px 0 var(--space-5) var(--space-4);
    position: sticky;
    top: var(--header-height);
    height: calc(100vh - var(--header-height));
    overflow-y: auto;
    scrollbar-width: none;
}
.sidebar::-webkit-scrollbar {
    display: none;
}
.sidebar > * {
    flex-shrink: 0;
}

.promo {
    /* Рекламная плашка всегда тёмная, в любой теме: фиксируем тёмные значения токенов внутри неё */
    --bg-card: #121624;
    --bg-elevated: #1a1f31;
    --text-primary: #eef0f6;
    --text-secondary: #a6adc2;
    --text-muted: #6b7390;
    --accent-hover: #9a5cff;
    color-scheme: dark;
    color: var(--text-primary);
    position: relative;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: 1px solid rgba(135, 62, 254, 0.35);
    background:
        radial-gradient(140% 120% at 100% 100%, rgba(135, 62, 254, 0.35), transparent 60%),
        var(--bg-card);
    overflow: hidden;
}
.promo__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: var(--text-muted);
    display: grid;
    place-items: center;
}
.promo__close:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
}
.promo__title {
    font-weight: 600;
    font-size: var(--fs-sm);
}
.promo__text {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    margin: 3px 0 6px;
}
.promo__link {
    font-size: var(--fs-xs);
    font-weight: 600;
    color: var(--accent-hover);
}
.promo__okx {
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-weight: 800;
    font-size: 16px;
    letter-spacing: 1px;
    color: var(--text-primary);
}

.side-card {
    background: var(--bg-card-sidebar);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-2);
}
.side-card--flush {
    padding: 0;
}

.exchange {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border-radius: var(--radius-sm);
    font-size: var(--fs-sm);
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
}
.exchange:hover {
    background: var(--bg-elevated);
    color: var(--text-secondary);
}
.exchange--active {
    background: var(--bg-elevated);
    color: var(--text-primary);
    font-weight: 600;
    box-shadow: inset 0 0 0 1px var(--border-strong);
}
.exchange__icon {
    display: block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 34px;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    padding: 0 10px;
    border-radius: var(--radius-sm);
}
.add-btn:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
}

.balances {
    padding: var(--space-3) var(--space-3) var(--space-2);
}
.balances--divided {
    border-top: 1px solid var(--border);
}
.balances__title {
    font-size: var(--fs-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 6px;
}
.balance {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--fs-sm);
    height: 26px;
}
.coin {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
}
.coin img {
    display: block;
    width: 100%;
    height: 100%;
}
.balance__amount {
    flex: 1;
}
.balance__coin {
    font-size: var(--fs-xs);
    color: var(--text-muted);
}
.all-link {
    display: inline-block;
    margin-top: 6px;
    font-size: var(--fs-xs);
    font-weight: 500;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: var(--space-3) 0;
}
.menu__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    padding: 0 var(--space-3);
    color: var(--text-secondary);
    font-size: var(--fs-md);
    font-weight: 500;
    border-radius: var(--radius-sm);
    transition: background 0.15s, color 0.15s;
}
.menu__item :deep(svg) {
    width: 18px;
    height: 18px;
    color: var(--text-muted);
}
.menu__item:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}
.menu__item--active {
    background: var(--bg-nav-active);
    color: var(--text-primary);
}
.menu__item--active :deep(svg) {
    color: var(--accent-hover);
}
.menu__item--active::before {
    content: "";
    position: absolute;
    left: -16px;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--accent);
}

.subscribe {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}
.subscribe__title {
    font-weight: 700;
    font-size: var(--fs-md);
}
.subscribe__text {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: 1.45;
    margin-bottom: var(--space-2);
}
.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 36px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    color: var(--text-primary);
    font-size: var(--fs-sm);
    font-weight: 500;
    transition: background 0.15s, border-color 0.15s;
}
.social-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--accent-muted);
}

.logout {
    margin-top: var(--space-2);
    color: var(--text-muted);
}
.logout:hover {
    background: var(--danger-soft);
    color: var(--danger-text);
}
.logout:hover :deep(svg) {
    color: var(--danger-text);
}
</style>
