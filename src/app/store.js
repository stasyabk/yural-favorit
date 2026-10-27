import { configureStore } from '@reduxjs/toolkit';
import { favoritApi } from '../services/favoritApi.js';
import searchReducer from '../features/search/searchSlice.js';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    [favoritApi.reducerPath]: favoritApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoritApi.middleware),
});
