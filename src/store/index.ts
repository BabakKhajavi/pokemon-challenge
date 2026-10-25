import { configureStore } from "@reduxjs/toolkit";
import { createRootReducer, apiMiddlewares } from "./root-reducer";

import type { Middleware, Reducer } from "@reduxjs/toolkit";
import type { PokemonState } from "../features/pokemon/types";
import type { pokemonApiSlice } from '../features/pokemon/api/pokemonApiSlice';
import { savePokemonPreferences } from '../features/pokemon/utils/pokemonPreferencesStorage';

const baseStore = configureStore({
  reducer: createRootReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Often needed for MFE cross-boundary data
    }).concat(apiMiddlewares as Middleware[]),
});

const asyncReducers: Record<string, Reducer> = {};

export const store = Object.assign(baseStore, {
  asyncReducers,
});

let previousFavoriteIds = (store.getState().pokemon as PokemonState).favoriteIds;
let previousSelectedTypes = (store.getState().pokemon as PokemonState).selectedTypes;
store.subscribe(() => {
  const { favoriteIds, selectedTypes } = store.getState().pokemon as PokemonState;
  if (favoriteIds !== previousFavoriteIds || selectedTypes !== previousSelectedTypes) {
    previousFavoriteIds = favoriteIds;
    previousSelectedTypes = selectedTypes;
    savePokemonPreferences({ favoriteIds, selectedTypes });
  }
});

export type RootState = ReturnType<typeof store.getState> & {
  pokemon: PokemonState;
  pokemonApi: ReturnType<typeof pokemonApiSlice.reducer>;
};
export type AppDispatch = typeof store.dispatch;
