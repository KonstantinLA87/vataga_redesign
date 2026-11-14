// Иконки монет с CDN Ватаги: https://static.vataga.trading/32x32/<ТИКЕР>.png
export const coinIcon = (ticker) => `https://static.vataga.trading/32x32/${ticker}.png`;

// Если картинки нет на CDN, прячем <img>, под ним остаётся цветной кружок-заглушка
export const hideBrokenIcon = (e) => (e.target.style.visibility = "hidden");
