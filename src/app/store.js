import { configureStore } from '@reduxjs/toolkit';
import { favoritApi } from '../services/favoritApi.js';

export const store = configureStore({
  reducer: {
    [favoritApi.reducerPath]: favoritApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoritApi.middleware),
});
