import { combineReducers } from "@reduxjs/toolkit";
import { pokemonApiSlice } from "../features/pokemon/api/pokemonApiSlice";
import pokemonReducer from "../features/pokemon/pokemonSlice";

// 1. Non-negotiable reducers
export const staticReducers = {
  [pokemonApiSlice.reducerPath]: pokemonApiSlice.reducer,
  pokemon: pokemonReducer,
};

// 2. Export the list of middlewares for the store
export const apiMiddlewares = [pokemonApiSlice.middleware];

export const createRootReducer = (asyncReducers?: any) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};
