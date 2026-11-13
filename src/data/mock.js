// Тестовые данные со скрина. Меняй как угодно.
export const pnl = { value: '11.3', unrealized: '-759' }

export const exchanges = [
  { name: 'Vataga | Binance Link', icon: 'binance', active: true },
  { name: 'Vataga | Bybit UTA', icon: 'bybit', active: false },
]

export const futuresBalances = [
  { amount: '1 384.1973', coin: 'USDT', color: '#26a17b' },
  { amount: '0.00', coin: 'USDC', color: '#2775ca' },
  { amount: '0.00', coin: 'BTC', color: '#f7931a' },
  { amount: '0.00', coin: 'BNB', color: '#f3ba2f' },
]

export const spotBalances = [
  { amount: '0.00', coin: '0G', color: '#a855f7' },
  { amount: '0.00', coin: '1000CAT', color: '#7a7a8c' },
  { amount: '0.00', coin: '1000CHEEMS', color: '#b07a3c' },
]

export const navItems = [
  { label: 'Фьючерсы', icon: 'percent', active: true },
  { label: 'Спот', icon: 'coins' },
  { label: 'Переводы', icon: 'wallet' },
  { label: 'Плечи', icon: 'sliders' },
  { label: 'Статистика', icon: 'chart' },
  { label: 'API-ключи', icon: 'key' },
]

export const positions = [
  { symbol: 'INITUSDT', lev: '20x', side: 'Long', mode: 'Кросс', margin: '-', size: '5 215', entry: '0.24508675', last: '0.10983', liq: '0.00', pnl: '-705' },
  { symbol: 'IDOLUSDT', lev: '20x', side: 'Short', mode: 'Кросс', margin: '-', size: '-6 779', entry: '0.02358738', last: '0.022798', liq: '0.10953171', pnl: '+5.35' },
  { symbol: 'ONEUSDT', lev: '20x', side: 'Long', mode: 'Кросс', margin: '-', size: '283 461', entry: '0.00169301', last: '0.0014817', liq: '0.00', pnl: '-59.8' },
]

export const orders = [
  { created: '13.11.2026 02:03', symbol: 'ONEUSDT', type: 'TAKE_PROFIT_MARKET', side: 'Sell', mode: 'Кросс', price: 'MARKET', stop: '0.001797', size: '0' },
  { created: '11.11.2026 21:32', symbol: 'INITUSDT', type: 'TAKE_PROFIT_MARKET', side: 'Sell', mode: 'Кросс', price: 'MARKET', stop: '0.24525', size: '0' },
]
