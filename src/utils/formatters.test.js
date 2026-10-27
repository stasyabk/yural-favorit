import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, formatValue } from './formatters.js';

test('prices are formatted without currency and preserve zero and decimals', () => {
  assert.equal(formatPrice(0), '0');
  assert.equal(formatPrice(1234.56), '1\u00a0234,56');
  assert.equal(formatPrice('12.3456'), '12,3456');
  assert.equal(formatPrice('12,5'), '12,5');
  assert.equal(formatPrice('0'), '0');
});

test('missing or invalid prices are unknown rather than zero', () => {
  for (const value of [null, undefined, '', ' ', 'unknown', NaN, Infinity, false, {}]) {
    assert.equal(formatPrice(value), '—');
  }
});

test('values preserve zero stock, warehouse identifiers and shipment cutoff time', () => {
  assert.equal(formatValue(0), '0');
  assert.equal(formatValue('>10'), '>10');
  assert.equal(formatValue('2026-10-27T15:30:00'), '2026-10-27T15:30:00');
  for (const value of [null, undefined, '', ' ', NaN, {}]) assert.equal(formatValue(value), '—');
});
