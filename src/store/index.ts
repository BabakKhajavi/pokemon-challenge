import { configureStore } from '@reduxjs/toolkit';
import { pokemonApiSlice } from '../features/pokemon/api/pokemonApiSlice';
import { savePokemonPreferences } from '../features/pokemon/utils/pokemonPreferencesStorage';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApiSlice.middleware),
});

let previousFavoriteIds = store.getState().pokemon.favoriteIds;
let previousSelectedTypes = store.getState().pokemon.selectedTypes;
store.subscribe(() => {
  const { favoriteIds, selectedTypes } = store.getState().pokemon;
  if (favoriteIds !== previousFavoriteIds || selectedTypes !== previousSelectedTypes) {
    previousFavoriteIds = favoriteIds;
    previousSelectedTypes = selectedTypes;
    savePokemonPreferences({ favoriteIds, selectedTypes });
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
