import { skipToken } from '@reduxjs/toolkit/query';
import { publicAsset } from '../../../utils/publicAsset';
import { useGetEvolutionChainQuery } from '../api/pokemonApiSlice';
import type { PokemonDetail, PokemonSpecies } from '../types';
import { getPokemonArtwork, pokemonArtworkFallback } from '../utils/getPokemonArtwork';
import styles from './PokemonDetailPanels.module.css';

const bookIcon = publicAsset('assets/book-blue-20.png');
const classificationIcon = publicAsset('assets/classification-blue-20.png');
const evolutionIcon = publicAsset('assets/evolution-blue-20.png');
const heightIcon = publicAsset('assets/height-blue-20.png');
const weightIcon = publicAsset('assets/weight-blue-20.png');

interface PokemonAboutProps {
  pokemon: PokemonDetail;
  species: PokemonSpecies;
}

const formatMeasurement = (value: number) => (value / 10).toFixed(1).replace(/\.0$/, '');

export const PokemonAbout = ({ pokemon, species }: PokemonAboutProps) => {
  const { data: evolution = [], isLoading, isError } = useGetEvolutionChainQuery(
    species.evolutionChainId ?? skipToken,
  );

  return (
    <div className={styles.about}>
      <section className={styles.aboutSection}>
        <img src={bookIcon} alt="" />
        <div>
          <h3>Pokédex Entry</h3>
          <p>{species.description}</p>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <span className={styles.sectionSymbol} aria-hidden="true">✧</span>
        <div>
          <h3>Training</h3>
          <dl className={styles.infoGrid}>
            <div><dt>Base EXP</dt><dd>{pokemon.baseExperience}</dd></div>
            <div><dt>Catch Rate</dt><dd>{species.captureRate}</dd></div>
            <div><dt>Growth Rate</dt><dd>{species.growthRate}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <img src={heightIcon} alt="" />
        <div>
          <h3>Physical Attributes</h3>
          <dl className={styles.infoGrid}>
            <div><dt>Height</dt><dd>{formatMeasurement(pokemon.height)} m</dd></div>
            <div><dt><img className={styles.inlineIcon} src={weightIcon} alt="" />Weight</dt><dd>{formatMeasurement(pokemon.weight)} kg</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <img src={evolutionIcon} alt="" />
        <div>
          <h3>Evolution Chain</h3>
          {isLoading && <p>Loading evolution chain...</p>}
          {isError && <p>Evolution chain unavailable.</p>}
          {!isLoading && !isError && evolution.length > 0 && (
            <div className={styles.evolution}>
              {evolution.map((stage, index) => (
                <div className={styles.evolutionStep} key={`${stage.id}-${stage.name}`}>
                  {index > 0 && (
                    <span className={styles.evolutionArrow} role="img" aria-label={stage.level ? `Evolves at level ${stage.level}` : 'Evolves'}>
                      →{stage.level && <small>Lv. {stage.level}</small>}
                    </span>
                  )}
                  <div className={styles.evolutionPokemon}>
                    <img src={getPokemonArtwork(stage.id) ?? pokemonArtworkFallback} alt="" loading="lazy" />
                    <span>{stage.name.replaceAll('-', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <img src={classificationIcon} alt="" />
        <div><h3>Classification</h3><span className={styles.classification}>{species.genus || 'Pokémon'}</span></div>
      </section>
    </div>
  );
};
