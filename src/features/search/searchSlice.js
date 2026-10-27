import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '', submittedQuery: '' },
  reducers: {
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

export const { setQuery, submitSearch } = searchSlice.actions;
export default searchSlice.reducer;
