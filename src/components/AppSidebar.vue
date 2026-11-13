<script setup>
import Icon from "./Icon.vue";
import { exchanges, futuresBalances, spotBalances, navItems } from "../data/mock.js";
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
                <span class="exchange__icon" :class="'exchange__icon--' + e.icon"></span>
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
                    <span class="coin" :style="{ background: b.color }"></span>
                    <span class="balance__amount">{{ b.amount }}</span>
                    <span class="balance__coin">{{ b.coin }}</span>
                </div>
            </div>
            <div class="balances balances--divided">
                <div class="balances__title">Спотовый счет</div>
                <div v-for="b in spotBalances" :key="b.coin" class="balance">
                    <span class="coin" :style="{ background: b.color }"></span>
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
    padding: var(--space-4) 0 var(--space-5) var(--space-4);
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
    position: relative;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1.5px solid #ff4d8d;
    background: linear-gradient(110deg, #1d1030 0%, #3a1450 60%, #6a1f6e 100%);
    overflow: hidden;
}
.promo__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0008;
    display: grid;
    place-items: center;
}
.promo__title {
    font-weight: 600;
    font-size: var(--fs-sm);
}
.promo__text {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    margin: 3px 0;
}
.promo__link {
    font-size: var(--fs-xs);
    color: var(--text-primary);
}
.promo__okx {
    position: absolute;
    right: 8px;
    bottom: 6px;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 1px;
}

.side-card {
    background: #131523;
    border-radius: 6px;
    border: 1px solid #3f4257;
    padding: var(--space-3);
}
.side-card--flush {
    padding: 0;
}

.exchange {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border-radius: var(--radius-sm);
    font-size: var(--fs-sm);
    color: var(--text-muted);
}
.exchange--active {
    background: var(--bg-elevated);
    color: var(--text-primary);
    font-weight: 600;
}
.exchange__icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
}
.exchange__icon--binance {
    background: radial-gradient(circle, #f3ba2f 35%, #2b2b2b 36%);
}
.exchange__icon--bybit {
    background: #f7a600;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    padding: 10px var(--space-3);
}

.balances {
    padding: var(--space-3);
}
.balances--divided {
    border-top: 1px solid var(--border);
}
.balances__title {
    font-size: var(--fs-sm);
    font-weight: 600;
    margin-bottom: 6px;
}
.balance {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--fs-sm);
    height: 25px;
}
.coin {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    flex-shrink: 0;
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
    padding: 10px var(--space-4) 10px 36px;
    color: var(--text-primary);
    font-size: var(--fs-sm);
    border-radius: var(--radius-sm);
}
.menu__item:hover {
    background: var(--bg-nav-active);
}
.menu__item--active {
    background: var(--bg-nav-active);
}
.menu__item--active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 4px;
    border-radius: 2px;
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
    font-size: var(--fs-lg);
}
.subscribe__text {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: 1.45;
    margin-bottom: var(--space-3);
}
.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-elevated);
    color: var(--text-primary);
    font-size: var(--fs-md);
}
.social-btn:hover {
    background: var(--bg-elevated-hover);
}

.logout {
    margin-top: var(--space-2);
    color: var(--text-secondary);
}
</style>
