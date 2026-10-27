import test from 'node:test';
import assert from 'node:assert/strict';
import { createFavoritBaseQuery } from './favoritBaseQuery.js';

function runQuery(fetchFn, params = { number: 'A &/+#' }, apiKey = 'test-only-key') {
  const baseQuery = createFavoritBaseQuery({ baseUrl: 'http://example.test/', apiKey, fetchFn });
  const controller = new AbortController();
  return baseQuery({ url: '', params }, {
    signal: controller.signal, abort: () => controller.abort(),
    dispatch: () => {}, getState: () => ({}), endpoint: 'test', type: 'query',
  }, {});
}

test('query parameters round-trip through URL encoding; request metadata is not returned', async () => {
  const params = { number: 'A &/+#', brand: 'ТЕСТ & +', analogues: 'on', info: 'on' };
  const result = await runQuery(async (request) => {
    const url = new URL(request.url);
    assert.deepEqual(Object.fromEntries(url.searchParams), { ...params, key: 'test-only-key' });
    return Response.json({ goods: [] });
  }, params);
  assert.deepEqual(result, { data: { goods: [] } });
});

test('missing key or empty input never sends a request', async () => {
  const fetchFn = () => { throw new Error('Request must not be sent'); };
  assert.equal((await runQuery(fetchFn, { number: '123' }, '')).error.data.code, 'MISSING_API_KEY');
  assert.equal((await runQuery(fetchFn, { number: ' ' })).error.data.code, 'INVALID_QUERY');
  assert.equal((await runQuery(fetchFn, { number: '123', brand: '' })).error.data.code, 'INVALID_QUERY');
});

test('HTTP 200 with API error is rejected and raw data cannot leak key', async () => {
  const result = await runQuery(async () => Response.json({ error: 'test-only-key' }));
  assert.equal(result.error.data.code, 'API_ERROR');
  assert.equal(JSON.stringify(result).includes('test-only-key'), false);
});

test('HTTP failures and invalid JSON are rejected without raw body or URL', async () => {
  const httpError = await runQuery(async () => Response.json({ error: 'test-only-key' }, { status: 403 }));
  assert.equal(httpError.error.status, 403);
  const parseError = await runQuery(async () => new Response('test-only-key', { status: 200 }));
  assert.equal(parseError.error.status, 'PARSING_ERROR');
  assert.equal(JSON.stringify([httpError, parseError]).includes('test-only-key'), false);
});

test('network failures return a controlled error', async () => {
  const result = await runQuery(async () => { throw new TypeError('test-only-key'); });
  assert.equal(result.error.status, 'FETCH_ERROR');
  assert.equal(JSON.stringify(result).includes('test-only-key'), false);
});

test('unexpected schemas are rejected, documented empty structures are accepted', async () => {
  for (const body of [null, [], { goods: {} }, { unexpected: true }]) {
    assert.equal((await runQuery(async () => Response.json(body))).error.data.code, 'INVALID_RESPONSE');
  }
  assert.deepEqual(await runQuery(async () => Response.json({})), { data: {} });
});
