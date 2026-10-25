import type { Pokemon, PokemonListItem } from "../types";

export const getRandomPair = (
  pokemons: PokemonListItem[],
): [PokemonListItem, PokemonListItem] => {
  const firstIndex = Math.floor(Math.random() * pokemons.length);

  let secondIndex = Math.floor(Math.random() * pokemons.length);

  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * pokemons.length);
  }

  return [pokemons[firstIndex], pokemons[secondIndex]];
};

export const getRandomMove = (pokemon: Pokemon) => {
  const index = Math.floor(Math.random() * pokemon.moves.length);

  return pokemon.moves[index]?.move?.name;
};
