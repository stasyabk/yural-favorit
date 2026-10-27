const priceFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 20 });

export function formatValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '—';
  if (typeof value === 'string' && value.trim()) return value;
  return '—';
}

export function formatPrice(value) {
  if (typeof value === 'string') {
    const text = value.trim();
    if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(text)) return '—';
    value = Number(text.replace(',', '.'));
  }
  return typeof value === 'number' && Number.isFinite(value) ? priceFormatter.format(value) : '—';
}
