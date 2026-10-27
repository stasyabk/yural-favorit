import { createApi } from '@reduxjs/toolkit/query/react';
import { createFavoritBaseQuery } from './favoritBaseQuery.js';
import { normalizeParts, normalizePartDetails } from '../utils/normalizeParts.js';

export const favoritApi = createApi({
  reducerPath: 'favoritApi',
  baseQuery: createFavoritBaseQuery({
    baseUrl: import.meta.env.VITE_FAVORIT_API_URL || 'http://api.favorit-parts.ru/hs/hsprice/',
    apiKey: import.meta.env.VITE_FAVORIT_API_KEY,
  }),
  endpoints: (builder) => ({
    getPartsByNumber: builder.query({
      query: (number) => ({ url: '', params: { number } }),
      transformResponse: normalizeParts,
    }),
    getPartDetails: builder.query({
      query: ({ number, brand }) => ({
        url: '', params: { number, brand, analogues: 'on', info: 'on' },
      }),
      transformResponse: (response, meta, { brand }) => normalizePartDetails(response, brand),
    }),
  }),
});

export const { useGetPartsByNumberQuery, useLazyGetPartsByNumberQuery, useGetPartDetailsQuery } = favoritApi;
