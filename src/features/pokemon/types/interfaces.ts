export interface Pokemon {
  name: string;
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  moves: { move: { name: string; url: string } }[];
}

export interface PokemonType {
  name: string;
  url: string;
  number?: string;
}

export interface PokemonTypeBadge {
  label: string;
  background: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  number: string;
  imageSrc: string | null;
  types: PokemonTypeBadge[];
}

export interface PokemonDetail extends PokemonListItem {
  height: number;
  weight: number;
  baseExperience: number;
  speciesId: number;
  abilities: { name: string; isHidden: boolean }[];
  stats: { name: string; value: number }[];
  moves: { name: string; level: number }[];
}

export interface PokemonSpecies {
  name: string;
  description: string;
  genus: string;
  captureRate: number;
  growthRate: string;
  evolutionChainId: number | null;
}

export interface PokemonEvolutionStage {
  id: number;
  name: string;
  level: number | null;
}

export interface PokemonState {
  selectedTypes: string[];
  favoriteIds: number[];
  favoritesOnly: boolean;
  selectedPokemon: PokemonListItem | null;
  isModalOpen: boolean;
}

export interface PokemonPreferences {
  selectedTypes: string[];
  favoriteIds: number[];
  pokemonTheme: string;
  colorMode: 'light' | 'dark';
}

export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  results: NamedResource[];
}

export interface PokemonPage {
  count: number;
  next: string | null;
  results: PokemonListItem[];
}

export interface PokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  species: NamedResource;
  sprites: {
    front_default: string | null;
    other: { 'official-artwork': { front_default: string | null } };
  };
  types: { type: NamedResource }[];
  abilities: { ability: NamedResource; is_hidden: boolean }[];
  stats: { base_stat: number; stat: NamedResource }[];
  moves: {
    move: NamedResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedResource;
    }[];
  }[];
}

export interface PokemonSpeciesResponse {
  name: string;
  capture_rate: number;
  growth_rate: NamedResource;
  evolution_chain: { url: string } | null;
  flavor_text_entries: {
    flavor_text: string;
    language: NamedResource;
  }[];
  genera: { genus: string; language: NamedResource }[];
}

export interface EvolutionNode {
  species: NamedResource;
  evolution_details: { min_level: number | null }[];
  evolves_to: EvolutionNode[];
}

export interface EvolutionChainResponse {
  chain: EvolutionNode;
}
