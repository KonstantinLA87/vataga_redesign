<script setup>
/*
 * Солнце днём, луна ночью: выглядывает из-под нижнего края родителя.
 * Родителю нужны position: relative и overflow: hidden.
 * Для проверки можно открыть страницу с ?sky=day или ?sky=night.
 */
import { ref, computed, onMounted, onUnmounted } from "vue";

const DAY_FROM = 6; // с 6:00
const DAY_TO = 18; // до 18:00

const now = ref(new Date());
let timer;
onMounted(() => {
    timer = setInterval(() => (now.value = new Date()), 60_000);
});
onUnmounted(() => clearInterval(timer));

const forced = new URLSearchParams(location.search).get("sky");
const isDay = computed(() => {
    if (forced === "day") return true;
    if (forced === "night") return false;
    const h = now.value.getHours();
    return h >= DAY_FROM && h < DAY_TO;
});
</script>

<template>
    <div class="sky" :class="isDay ? 'sky--day' : 'sky--night'" aria-hidden="true">
        <template v-if="!isDay">
            <span class="star" style="left: 18%; top: 62%; animation-delay: 0s"></span>
            <span class="star" style="left: 30%; top: 80%; animation-delay: 1.2s"></span>
            <span class="star" style="left: 74%; top: 66%; animation-delay: 0.6s"></span>
            <span class="star" style="left: 85%; top: 84%; animation-delay: 1.8s"></span>
        </template>
        <div class="body">
            <template v-if="!isDay">
                <i class="crater" style="width: 15px; height: 15px; left: 32%; top: 14%"></i>
                <i class="crater" style="width: 8px; height: 8px; left: 58%; top: 10%"></i>
                <i class="crater" style="width: 11px; height: 11px; left: 64%; top: 26%"></i>
            </template>
        </div>
    </div>
</template>

<style scoped>
.sky {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.body {
    --size: 100px;
    position: absolute;
    left: 50%;
    bottom: calc(var(--size) * -0.72); /* видна верхняя четверть */
    width: var(--size);
    height: var(--size);
    margin-left: calc(var(--size) / -2);
    border-radius: 50%;
    animation: rise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* Солнце */
.sky--day .body {
    background: radial-gradient(circle at 50% 40%, #fff4c2 0%, #ffd45c 35%, #ff9f43 75%, #ff7a3d 100%);
    box-shadow:
        0 0 40px 8px rgba(255, 180, 70, 0.35),
        0 0 80px 26px rgba(255, 150, 60, 0.15);
}
/* Лучи: статичное мягкое кольцо вокруг солнца */
.sky--day .body::before {
    content: "";
    position: absolute;
    inset: -23px;
    border-radius: 50%;
    background: repeating-conic-gradient(from 0deg, rgba(255, 200, 90, 0.35) 0deg 4deg, transparent 4deg 18deg);
    -webkit-mask: radial-gradient(circle, transparent 58%, #000 60%, transparent 72%);
    mask: radial-gradient(circle, transparent 58%, #000 60%, transparent 72%);
}

/* Луна */
.sky--night .body {
    background: radial-gradient(circle at 40% 30%, #f6f4ff 0%, #d9d6ea 45%, #a9a5c4 100%);
    box-shadow:
        0 0 30px 6px rgba(200, 195, 255, 0.25),
        0 0 70px 20px rgba(135, 62, 254, 0.18);
}
.crater {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, rgba(120, 115, 150, 0.35), rgba(120, 115, 150, 0.15));
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
}

.star {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.6);
    animation: twinkle 3s ease-in-out infinite;
}

@keyframes rise {
    from {
        transform: translateY(40px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
@keyframes twinkle {
    0%,
    100% {
        opacity: 0.25;
    }
    50% {
        opacity: 0.9;
    }
}

@media (prefers-reduced-motion: reduce) {
    .body,
    .star {
        animation: none;
    }
}
</style>
