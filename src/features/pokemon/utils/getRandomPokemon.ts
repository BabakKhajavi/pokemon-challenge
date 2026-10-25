import type { Pokemon, PokemonListItem } from '../types';

export const getRandomPair = (
  pokemons: PokemonListItem[],
): [PokemonListItem, PokemonListItem] => {
  if (pokemons.length < 2) {
    throw new RangeError('At least two Pokémon are required to choose a pair.');
  }

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
