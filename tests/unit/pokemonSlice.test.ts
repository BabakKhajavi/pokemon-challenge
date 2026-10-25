import reducer, {
  closePokemonModal,
  selectPokemon,
  setSelectedTypes,
  toggleFavorite,
  toggleSelectedType,
} from '../../src/features/pokemon/pokemonSlice';

describe('pokemon state', () => {
  it('toggles type selections without duplicates and normalizes case', () => {
    const initial = reducer(undefined, { type: '@@init' });
    const selected = reducer(initial, setSelectedTypes(['Fire', 'fire', 'WATER']));
    expect(selected.selectedTypes).toEqual(['fire', 'water']);
    expect(reducer(selected, toggleSelectedType('FIRE')).selectedTypes).toEqual(['water']);
  });

  it('toggles favorites and opens and closes the selected Pokémon', () => {
    const initial = reducer(undefined, { type: '@@init' });
    const favorite = reducer(initial, toggleFavorite(1));
    expect(favorite.favoriteIds).toEqual([1]);
    expect(reducer(favorite, toggleFavorite(1)).favoriteIds).toEqual([]);

    const pokemon = { id: 1, name: 'bulbasaur', number: '001', imageSrc: null, types: [] };
    const opened = reducer(favorite, selectPokemon(pokemon));
    expect(opened).toMatchObject({ selectedPokemon: pokemon, isModalOpen: true });
    expect(reducer(opened, closePokemonModal())).toMatchObject({ selectedPokemon: null, isModalOpen: false });
  });
});
