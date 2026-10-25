import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PokemonListItem, PokemonState } from './types';
import { loadPokemonPreferences } from './utils/pokemonPreferencesStorage';

const initialState = (): PokemonState => {
  const { selectedTypes, favoriteIds } = loadPokemonPreferences();
  return { selectedTypes, favoriteIds, favoritesOnly: false, selectedPokemon: null, isModalOpen: false };
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    selectPokemon(state, action: PayloadAction<PokemonListItem>) {
      state.selectedPokemon = action.payload;
      state.isModalOpen = true;
    },
    closePokemonModal(state) {
      state.isModalOpen = false;
      state.selectedPokemon = null;
    },
    toggleSelectedType(state, action: PayloadAction<string>) {
      const typeName = action.payload.toLowerCase();
      const index = state.selectedTypes.indexOf(typeName);

      if (index === -1) {
        state.selectedTypes.push(typeName);
      } else {
        state.selectedTypes.splice(index, 1);
      }
    },
    setSelectedTypes(state, action: PayloadAction<string[]>) {
      state.selectedTypes = [...new Set(action.payload.map((type) => type.toLowerCase()))];
    },
    clearSelectedTypes(state) {
      state.selectedTypes = [];
    },
    toggleFavorite(state, action: PayloadAction<number>) {
      const index = state.favoriteIds.indexOf(action.payload);
      if (index === -1) state.favoriteIds.push(action.payload);
      else state.favoriteIds.splice(index, 1);
    },
    setFavoritesOnly(state, action: PayloadAction<boolean>) {
      state.favoritesOnly = action.payload;
    },
  },
});

export const { selectPokemon, closePokemonModal, toggleSelectedType, setSelectedTypes, clearSelectedTypes, toggleFavorite, setFavoritesOnly } =
  pokemonSlice.actions;

export default pokemonSlice.reducer;
