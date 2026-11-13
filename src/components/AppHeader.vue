<script setup>
import Icon from "./Icon.vue";
import logo from "../assets/img/logo-dark.svg";
const links = ["Риск-менеджер", "Транзакции", "Терминал"];
const icons = ["chat", "help", "download", "globe", "settings"];
</script>

<template>
    <header class="header">
        <a class="logo" href="#">
            <img :src="logo" alt="Vataga Crypto" class="logo__img" />
        </a>

        <nav class="nav">
            <a v-for="l in links" :key="l" href="#" class="nav__link">{{ l }}</a>
            <a href="#" class="nav__team">team</a>
            <button class="icon-btn">
                <Icon name="bell" :size="24" />
                <span class="counter">460</span>
            </button>
            <button v-for="i in icons" :key="i" class="icon-btn"><Icon :name="i" :size="24" /></button>
        </nav>
    </header>
</template>

<style scoped>
.header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-5) 0 var(--space-4);
    background: var(--bg-header);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 10;
}
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
}
.logo__img {
    display: block;
    height: 26px;
    width: auto;
}
.nav {
    display: flex;
    align-items: center;
    gap: 4px;
}
.nav__link {
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    font-weight: 500;
    padding: 7px 12px;
    border-radius: var(--radius-sm);
    transition: background 0.15s, color 0.15s;
}
.nav__link:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
}
.nav__team {
    color: var(--brand-team);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    margin: 0 10px 0 6px;
    border: 1px solid rgba(255, 92, 138, 0.35);
    border-radius: var(--radius-pill);
    background: rgba(255, 92, 138, 0.08);
}
.icon-btn {
    position: relative;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
}
.icon-btn :deep(svg) {
    width: 20px;
    height: 20px;
}
.icon-btn:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
}
.counter {
    position: absolute;
    top: 3px;
    right: 1px;
    min-width: 18px;
    background: var(--danger);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    line-height: 14px;
    padding: 0 4px;
    border-radius: var(--radius-pill);
    box-shadow: 0 0 0 2px var(--bg-page);
}
</style>
