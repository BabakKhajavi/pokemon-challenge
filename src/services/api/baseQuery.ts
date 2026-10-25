import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});
