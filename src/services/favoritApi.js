import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Endpoints и интеграция с API добавляются на этапе 2.
export const favoritApi = createApi({
  reducerPath: 'favoritApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_FAVORIT_API_URL || 'http://api.favorit-parts.ru/hs/hsprice/',
  }),
  endpoints: () => ({}),
});
