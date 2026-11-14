import { ref, watch } from "vue";

// Тема кабинета: "dark" (по умолчанию) или "light". Запоминается в localStorage.
const KEY = "vataga.theme";

function read() {
    try {
        return localStorage.getItem(KEY) === "light" ? "light" : "dark";
    } catch {
        return "dark";
    }
}

const theme = ref(read());

watch(
    theme,
    (t) => {
        document.documentElement.dataset.theme = t;
        try {
            localStorage.setItem(KEY, t);
        } catch {}
    },
    { immediate: true }
);

export function useTheme() {
    const toggle = () => (theme.value = theme.value === "dark" ? "light" : "dark");
    return { theme, toggle };
}
