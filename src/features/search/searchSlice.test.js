import test from 'node:test';
import assert from 'node:assert/strict';
import searchReducer, { setQuery, submitSearch } from './searchSlice.js';

test('editing input preserves the submitted query and has no server data', () => {
  const submitted = searchReducer(undefined, submitSearch('123'));
  const edited = searchReducer(submitted, setQuery('new draft'));
  assert.deepEqual(edited, { query: 'new draft', submittedQuery: '123' });
});

test('a new search replaces confirmed parameters rather than creating history', () => {
  const previous = searchReducer(undefined, submitSearch('123'));
  assert.deepEqual(searchReducer(previous, submitSearch(' 456 ')), {
    query: '456', submittedQuery: '456',
  });
  assert.deepEqual(previous, { query: '123', submittedQuery: '123' });
});

test('blank submission cannot replace the active search', () => {
  const previous = searchReducer(undefined, submitSearch('123'));
  assert.deepEqual(searchReducer(previous, submitSearch('  ')), previous);
});
