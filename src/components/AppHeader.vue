<script setup>
import Icon from "./Icon.vue";
const links = ["Риск-менеджер", "Транзакции", "Терминал"];
const icons = ["chat", "help", "download", "globe", "settings"];
</script>

<template>
    <header class="header">
        <a class="logo" href="#">
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M2 4l7 16 3-7-4-9zM12 13l3 7 7-16h-4z" fill="var(--brand-logo)" /></svg>
            <span>Vataga Crypto</span>
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
    padding: 0 var(--space-4);
    background: #131523;
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
    font-weight: 600;
    font-size: 21px;
}
.nav {
    display: flex;
    align-items: center;
    gap: 22px;
}
.nav__link {
    color: var(--text-primary);
    font-size: var(--fs-sm);
}
.nav__link:hover {
    color: var(--text-secondary);
}
.nav__team {
    color: var(--brand-team);
    font-style: italic;
    font-size: 20px;
    font-family: "Comic Sans MS", cursive;
}
.icon-btn {
    position: relative;
    color: var(--text-secondary);
    display: flex;
    padding: 4px;
}
.icon-btn:hover {
    color: var(--text-primary);
}
.counter {
    position: absolute;
    top: -4px;
    right: -8px;
    background: var(--danger);
    color: #fff;
    font-size: 9px;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: var(--radius-pill);
}
</style>
