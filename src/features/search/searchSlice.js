import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '', submittedQuery: '' },
  reducers: {
    clearSearch(state) {
      state.query = '';
      state.submittedQuery = '';
    },
    setQuery(state, action) {
      state.query = action.payload;
    },
    submitSearch(state, action) {
      const number = action.payload.trim();
      if (!number) return;
      state.query = number;
      state.submittedQuery = number;
    },
  },
});

export const { clearSearch, setQuery, submitSearch } = searchSlice.actions;
export default searchSlice.reducer;
