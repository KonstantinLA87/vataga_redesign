<script setup>
import Icon from "./Icon.vue";
import Tooltip from "./Tooltip.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";
import logoDark from "../assets/img/logo-dark.svg";
import logoLight from "../assets/img/logo-light.svg";
import { useTheme } from "../composables/useTheme.js";

const { theme, toggle } = useTheme();
const logo = computed(() => (theme.value === "light" ? logoLight : logoDark));
const links = ["Риск-менеджер", "Транзакции"];

// Открытое выпадающее меню: null | "download" | "settings".
// Закрывается кликом мимо меню и по Esc.
const openMenu = ref(null);
const toggleMenu = (name) => (openMenu.value = openMenu.value === name ? null : name);
const closeMenu = () => (openMenu.value = null);
const onDocClick = (e) => {
    if (openMenu.value && !e.target.closest(".menu-wrap")) closeMenu();
};
const onKey = (e) => {
    if (e.key === "Escape") closeMenu();
};
onMounted(() => {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
});
onUnmounted(() => {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onKey);
});
</script>

<template>
    <header class="header">
        <a class="logo" href="#">
            <img :src="logo" alt="Vataga Crypto" class="logo__img" />
        </a>

        <nav class="nav">
            <a v-for="l in links" :key="l" href="#" class="nav__link">{{ l }}</a>

            <!-- «Скачать»: терминал для ПК и мобильное приложение -->
            <div class="menu-wrap">
                <button
                    class="nav__link nav__link--drop download-btn"
                    :class="{ 'nav__link--on': openMenu === 'download' }"
                    aria-haspopup="menu"
                    :aria-expanded="openMenu === 'download'"
                    @click="toggleMenu('download')"
                >
                    Скачать
                    <Icon name="chevron" :size="14" class="nav__chevron" />
                </button>
                <Transition name="pop">
                    <div v-if="openMenu === 'download'" class="menu menu--left" role="menu">
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="monitor" :size="16" /> Терминал для ПК
                        </a>
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="phone" :size="16" /> Мобильное приложение
                        </a>
                    </div>
                </Transition>
            </div>

            <a href="#" class="nav__team">team</a>

            <button class="icon-btn" aria-label="Уведомления">
                <Icon name="bell" :size="24" />
                <span class="counter">460</span>
            </button>

            <Tooltip text="Поддержка" placement="bottom">
                <button class="icon-btn" aria-label="Написать в поддержку"><Icon name="chats" :size="24" /></button>
            </Tooltip>

            <!-- Шестерёнка: всё редкое -->
            <div class="menu-wrap">
                <button
                    class="icon-btn settings-btn"
                    :class="{ 'icon-btn--on': openMenu === 'settings' }"
                    aria-label="Настройки"
                    aria-haspopup="menu"
                    :aria-expanded="openMenu === 'settings'"
                    @click="toggleMenu('settings')"
                >
                    <Icon name="settings" :size="24" />
                </button>
                <Transition name="pop">
                    <div v-if="openMenu === 'settings'" class="menu menu--wide" role="menu">
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="user" :size="16" /> Профиль
                        </a>
                        <div class="menu__sep"></div>
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="globe" :size="16" /> Язык
                            <span class="menu__hint">Русский</span>
                            <Icon name="chevronRight" :size="14" class="menu__arrow" />
                        </a>
                        <!-- Тема переключается прямо в строке, меню не закрывается -->
                        <button class="menu__item theme-item" role="menuitemcheckbox" :aria-checked="theme === 'dark'" @click="toggle">
                            <Icon :name="theme === 'dark' ? 'moon' : 'sun'" :size="16" /> Тёмная тема
                            <span class="switch" :class="{ 'switch--on': theme === 'dark' }"><span class="switch__knob"></span></span>
                        </button>
                        <div class="menu__sep"></div>
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="help" :size="16" /> Помощь и справка
                            <Icon name="chevronRight" :size="14" class="menu__arrow" />
                        </a>
                        <a href="#" class="menu__item" role="menuitem" @click.prevent="closeMenu">
                            <Icon name="chats" :size="16" /> Написать в поддержку
                        </a>
                    </div>
                </Transition>
            </div>
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
    width: 160px; /* было ~180px; высота подстраивается пропорционально (~23px) */
    height: auto;
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
    background: var(--team-bg);
    transition: 0.15s;

    &:hover {
      background: var(--team-bg-hover);
      box-shadow: 0px 0px 20px rgba(255, 92, 138, 0.302);
    }
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
.icon-btn:hover,
.icon-btn--on {
    color: var(--text-primary);
    background: var(--bg-elevated);
}
.counter {
    position: absolute;
    top: 3px;
    right: 1px;
    min-width: 16px;
    background: var(--danger);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    line-height: 13px; /* поля вокруг цифр на 1px меньше */
    padding: 0 3px;
    border-radius: var(--radius-pill);
    box-shadow: 0 0 0 2px var(--bg-page);
}

/* Выпадающее меню под шестерёнкой */
.menu-wrap {
    position: relative;
}
.menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 190px;
    padding: 4px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-pop);
    z-index: 20;
}
.menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
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

/* Ссылка-выпадашка «Скачать» */
.nav__link--drop {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: inherit;
}
.nav__link--on {
    color: var(--text-primary);
    background: var(--bg-elevated);
}
.nav__chevron {
    transition: transform 0.15s;
}
.nav__link--on .nav__chevron {
    transform: rotate(180deg);
}
.menu--left {
    left: 0;
    right: auto;
}
.menu--wide {
    min-width: 240px;
}
.menu__item {
    width: 100%;
    text-align: left;
    font-family: inherit;
}
.menu__hint {
    margin-left: auto;
    color: var(--text-muted);
    font-size: var(--fs-xs);
}
.menu__arrow {
    margin-left: auto;
    color: var(--text-muted);
}
.menu__hint + .menu__arrow {
    margin-left: -4px;
}
.menu__sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--border-strong);
}

/* Переключатель темы в строке меню */
.switch {
    margin-left: auto;
    position: relative;
    width: 30px;
    height: 18px;
    border-radius: var(--radius-pill);
    background: var(--border-strong);
    transition: background 0.15s;
    flex-shrink: 0;
}
.switch__knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    transition: transform 0.15s;
}
.switch--on {
    background: var(--accent);
}
.switch--on .switch__knob {
    transform: translateX(12px);
}
</style>
