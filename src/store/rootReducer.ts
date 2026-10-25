import { combineReducers } from '@reduxjs/toolkit';
import { pokemonApiSlice } from '../features/pokemon/api/pokemonApiSlice';
import pokemonReducer from '../features/pokemon/pokemonSlice';

export const rootReducer = combineReducers({
  [pokemonApiSlice.reducerPath]: pokemonApiSlice.reducer,
  pokemon: pokemonReducer,
});
