import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeParts, normalizePartDetails } from './normalizeParts.js';

test('empty responses and empty goods do not create fictitious parts', () => {
  for (const response of [{}, { goods: [] }, { goods: [{}] }, { goods: [null, {}, { brand: '' }] }]) {
    assert.deepEqual(normalizeParts(response), []);
    assert.deepEqual(normalizePartDetails(response, 'TEST'), { offers: [], analogues: [] });
  }
});

test('warehouse prices, zero stock, dates and nonrefundable flags survive flattening', () => {
  const response = { goods: [{
    brand: 'TEST', number: '123', name: 'Test part', price: 9999, notRefund: true,
    warehouses: [
      { code: 'A', price: 0, stock: 0, shipmentDate: '2026-10-27T15:00:00' },
      { id: 0, price: 25, stock: 3, notRefund: false },
    ],
    analogues: [{ brand: 'OTHER', number: '456', warehouses: [{ id: 2, price: 15, stock: 0 }] }],
  }] };
  const { offers, analogues } = normalizePartDetails(response, 'TEST');
  assert.equal(offers.length, 2);
  assert.deepEqual(offers.map(({ price, stock }) => [price, stock]), [[0, 0], [25, 3]]);
  assert.equal(offers[0].shipmentDate, '2026-10-27T15:00:00');
  assert.equal(offers[0].notRefund, true);
  assert.equal(offers[1].notRefund, false);
  assert.equal(offers[1].warehouse, 0);
  assert.equal(analogues[0].brand, 'OTHER');
  assert.deepEqual(analogues, [{ brand: 'OTHER', number: '456', name: null }]);
  assert.equal(Object.hasOwn(normalizeParts(response)[0], 'price'), false);
});

test('empty API placeholders with default ID or echoed number are not real goods', () => {
  const emptyResponse = { goods: [
    { goodsID: 0, brand: '', number: '', name: '', warehouses: [], analogues: [] },
    { goodsID: '0', number: 'NOT-FOUND', brand: '  ', name: null },
    { goodsID: 123 },
    { number: 'NOT-FOUND' },
    { brand: 'TEST' },
    { name: ' ' },
  ] };
  assert.deepEqual(normalizeParts(emptyResponse), []);
  assert.deepEqual(normalizePartDetails(emptyResponse, 'TEST'), { offers: [], analogues: [] });
});

test('valid identity survives missing optional name and zero stock alongside empty placeholders', () => {
  const parts = normalizeParts({ goods: [
    { goodsID: 0 },
    { brand: 'TEST', number: '123', name: '', warehouses: [{ price: 10, stock: 0 }] },
  ] });
  assert.equal(parts.length, 1);
  assert.equal(parts[0].number, '123');
  assert.equal(parts[0].warehouses[0].stock, 0);
});

test('missing optional fields and warehouses do not manufacture offers', () => {
  const response = { goods: [{ brand: 'TEST', number: '123', warehouses: [], analogues: [{}] }] };
  assert.equal(normalizeParts(response)[0].name, null);
  assert.deepEqual(normalizePartDetails(response, 'TEST'), { offers: [], analogues: [] });
});

test('duplicate offers are retained and other manufacturers are excluded from first table', () => {
  const part = { brand: 'TEST', number: '123', warehouses: [{ price: 5, stock: 1 }] };
  const response = { goods: [part, part, { ...part, brand: 'OTHER' }] };
  assert.equal(normalizePartDetails(response, 'TEST').offers.length, 2);
});

test('warehouse identifiers fall back from blank code to id and missing values remain unknown', () => {
  const response = { goods: [{ brand: 'TEST', number: '123', warehouses: [
    { code: '  ', id: 0, stock: 0 },
    { code: 'A', id: 9, price: 25 },
    {}, null,
  ] }] };
  const { offers } = normalizePartDetails(response, 'TEST');
  assert.equal(offers.length, 2);
  assert.equal(offers[0].warehouse, 0);
  assert.equal(offers[0].price, null);
  assert.equal(offers[0].stock, 0);
  assert.equal(offers[1].warehouse, 'A');
  assert.equal(offers[1].shipmentDate, null);
});

test('unique analogues include parts without warehouses and never expose warehouse fields', () => {
  const analogue = { brand: 'OTHER', number: '456', price: 9999, warehouses: [
    { id: 1, price: 15, stock: 0 }, { id: 2, price: 20, stock: 5 },
  ] };
  const response = { goods: [{ brand: 'TEST', number: '123', warehouses: [], analogues: [
    { brand: 'EMPTY', number: '789' }, analogue, analogue,
  ] }] };
  const details = normalizePartDetails(response, 'TEST');
  assert.deepEqual(details.offers, []);
  assert.deepEqual(details.analogues, [
    { brand: 'EMPTY', number: '789', name: null },
    { brand: 'OTHER', number: '456', name: null },
  ]);
});

test('analogue uniqueness uses both brand and number across parent goods and preserves first-seen order', () => {
  const response = { goods: [
    { brand: 'TEST', number: '123', warehouses: [{ id: 1, price: 10, stock: 0 }], analogues: [
      { brand: 'A', number: '1', name: '' },
      { brand: 'A', number: '2', name: 'Second' },
      { brand: 'B', number: '1', name: 'Another brand' },
    ] },
    { brand: 'TEST', number: '123', warehouses: [{ id: 2, price: 20, stock: 1 }], analogues: [
      { brand: 'A', number: '1', name: 'Available name' },
      { brand: 'A', number: '2', name: 'Later name' },
    ] },
  ] };
  const details = normalizePartDetails(response, 'TEST');
  assert.equal(details.offers.length, 2);
  assert.deepEqual(details.offers.map((row) => row.price), [10, 20]);
  assert.deepEqual(details.analogues, [
    { brand: 'A', number: '1', name: 'Available name' },
    { brand: 'A', number: '2', name: 'Second' },
    { brand: 'B', number: '1', name: 'Another brand' },
  ]);
});
