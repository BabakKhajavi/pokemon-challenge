import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../services/api/baseApi';
import { formatPokemonNumber } from '../../../utils/formatPokemonNumber';
import { getPokemonArtwork } from '../utils/getPokemonArtwork';
import {
  CacheTags,
  TYPE_COLORS,
  type EvolutionChainResponse,
  type EvolutionNode,
  type PokemonDetail,
  type PokemonEvolutionStage,
  type PokemonListResponse,
  type PokemonPage,
  type PokemonResponse,
  type PokemonSpecies,
  type PokemonSpeciesResponse,
  type PokemonType,
} from '../types';

const displayName = (name: string) => name.replaceAll('-', ' ');
const resourceId = (url: string) => {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Invalid PokéAPI resource URL: ${url}`);
  return Number(match[1]);
};

const transformPokemon = (response: PokemonResponse): PokemonDetail => {
  const levelUpMoves = response.moves.flatMap(({ move, version_group_details }) => {
    const levels = version_group_details
      .filter(({ move_learn_method }) => move_learn_method.name === 'level-up')
      .map(({ level_learned_at }) => level_learned_at);
    return levels.length ? [{ name: displayName(move.name), level: Math.min(...levels) }] : [];
  });

  return {
    id: response.id,
    name: response.name,
    number: formatPokemonNumber(response.id),
    imageSrc: getPokemonArtwork(response.id),
    types: response.types.map(({ type }) => ({
      label: type.name,
      background: TYPE_COLORS[type.name] ?? '#64748b',
    })),
    height: response.height,
    weight: response.weight,
    baseExperience: response.base_experience,
    speciesId: resourceId(response.species.url),
    abilities: response.abilities.map(({ ability, is_hidden }) => ({
      name: displayName(ability.name),
      isHidden: is_hidden,
    })),
    stats: response.stats.map(({ stat, base_stat }) => ({ name: stat.name, value: base_stat })),
    moves: levelUpMoves.sort((a, b) => a.level - b.level),
  };
};

const basePokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery,
  tagTypes: [CacheTags.POKEMON_LIST, CacheTags.POKEMON],
  endpoints: (builder) => ({
    getPokemon: builder.query<PokemonDetail, number>({
      query: (id) => `/pokemon/${id}`,
      transformResponse: transformPokemon,
      providesTags: [CacheTags.POKEMON],
      keepUnusedDataFor: 3600,
    }),
    getPokemonSpecies: builder.query<PokemonSpecies, number>({
      query: (id) => `/pokemon-species/${id}`,
      transformResponse: (response: PokemonSpeciesResponse): PokemonSpecies => ({
        name: response.name,
        description: response.flavor_text_entries
          .find(({ language }) => language.name === 'en')
          ?.flavor_text.replace(/\s+/g, ' ').trim() ?? 'No Pokédex entry available.',
        genus: response.genera.find(({ language }) => language.name === 'en')?.genus ?? '',
        captureRate: response.capture_rate,
        growthRate: displayName(response.growth_rate.name),
        evolutionChainId: response.evolution_chain ? resourceId(response.evolution_chain.url) : null,
      }),
      keepUnusedDataFor: 3600,
    }),
    getEvolutionChain: builder.query<PokemonEvolutionStage[], number>({
      query: (id) => `/evolution-chain/${id}`,
      transformResponse: (response: EvolutionChainResponse): PokemonEvolutionStage[] => {
        const stages: PokemonEvolutionStage[] = [];
        const visit = (node: EvolutionNode) => {
          const id = resourceId(node.species.url);
          stages.push({
            id,
            name: node.species.name,
            level: node.evolution_details[0]?.min_level ?? null,
          });
          node.evolves_to.forEach(visit);
        };
        visit(response.chain);
        return stages;
      },
      keepUnusedDataFor: 3600,
    }),
    getPokemonTypes: builder.query<PokemonType[], void>({
      query: () => '/type',
      transformResponse: (response: PokemonListResponse): PokemonType[] => response.results,
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const pokemonApiSlice = basePokemonApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavoritePokemon: builder.query<PokemonDetail[], number[]>({
      async queryFn(ids, api) {
        try {
          const data = await Promise.all(ids.map((id) =>
            api.dispatch(basePokemonApi.endpoints.getPokemon.initiate(id, { subscribe: false })).unwrap(),
          ));
          return { data };
        } catch {
          return { error: { status: 'CUSTOM_ERROR', error: 'Could not load favorite Pokémon' } };
        }
      },
      keepUnusedDataFor: 3600,
    }),
    getPokemonList: builder.infiniteQuery<PokemonPage, void, string>({
      infiniteQueryOptions: {
        initialPageParam: '/pokemon?limit=20&offset=0',
        getNextPageParam: (lastPage) => lastPage.next ?? undefined,
      },
      async queryFn({ pageParam }, _api, _extraOptions, queryBase) {
        const pageResponse = await queryBase(pageParam);
        if (pageResponse.error) return { error: pageResponse.error };

        const page = pageResponse.data as PokemonListResponse;
        const results = page.results.map((pokemon) => {
          const id = resourceId(pokemon.url);
          return {
            id,
            name: pokemon.name,
            number: formatPokemonNumber(id),
            imageSrc: getPokemonArtwork(id),
            types: [],
          };
        });

        return { data: { count: page.count, next: page.next, results } };
      },
      providesTags: [CacheTags.POKEMON_LIST],
    }),
  }),
});

export const {
  useGetFavoritePokemonQuery,
  useGetPokemonListInfiniteQuery,
  useGetPokemonQuery,
  useGetPokemonSpeciesQuery,
  useGetEvolutionChainQuery,
  useGetPokemonTypesQuery,
} = pokemonApiSlice;
