import { publicAsset } from '../../../utils/publicAsset';
import type { PokemonDetail } from '../types';
import styles from './PokemonDetailCard.module.css';
import { FavoriteButton } from '../components/FavoriteButton';
import { getReadableTextColor } from '../utils/getReadableTextColor';
import { pokemonArtworkFallback } from '../utils/getPokemonArtwork';

const abilitiesIcon = publicAsset('assets/abilities-yellow-16.png');
const heightIcon = publicAsset('assets/height-blue-16.png');
const hiddenAbilityIcon = publicAsset('assets/hidden-ability-purple-16.png');
const weightIcon = publicAsset('assets/weight-green-16.png');

interface PokemonDetailCardProps {
  pokemon: PokemonDetail;
}

const formatMeasurement = (value: number) =>
  (value / 10).toFixed(1).replace(/\.0$/, '');

export const PokemonDetailCard = ({ pokemon }: PokemonDetailCardProps) => {
  const regularAbility = pokemon.abilities.find((ability) => !ability.isHidden);
  const hiddenAbility = pokemon.abilities.find((ability) => ability.isHidden);

  return (
    <section className={styles.card} aria-label={`${pokemon.name} summary`}>
      <div className={styles.artwork}>
        <img
          src={pokemon.imageSrc ?? pokemonArtworkFallback}
          alt={pokemon.imageSrc ? pokemon.name : `Artwork unavailable for ${pokemon.name}`}
        />
      </div>
      <div className={styles.details}>
        <div className={styles.numberRow}>
          <span className={styles.number}>#{pokemon.number}</span>
          <FavoriteButton pokemonId={pokemon.id} name={pokemon.name} />
        </div>
        <h3 className={styles.name}>{pokemon.name.replaceAll('-', ' ')}</h3>
        <div className={styles.badges} role="group" aria-label="Pokémon types">
          {pokemon.types.map((type) => (
            <span key={type.label} className={styles.badge} style={{ backgroundColor: type.background, color: getReadableTextColor(type.background) }}>
              {type.label}
            </span>
          ))}
        </div>
        <dl className={styles.attributes}>
          <div className={styles.attribute}>
            <img src={heightIcon} alt="" />
            <div><dt>Height</dt><dd>{formatMeasurement(pokemon.height)} m</dd></div>
          </div>
          <div className={styles.attribute}>
            <img src={weightIcon} alt="" />
            <div><dt>Weight</dt><dd>{formatMeasurement(pokemon.weight)} kg</dd></div>
          </div>
          <div className={styles.attribute}>
            <img src={abilitiesIcon} alt="" />
            <div><dt>Abilities</dt><dd>{regularAbility?.name ?? 'None'}</dd></div>
          </div>
          <div className={styles.attribute}>
            <img src={hiddenAbilityIcon} alt="" />
            <div><dt>Hidden Ability</dt><dd>{hiddenAbility?.name ?? 'None'}</dd></div>
          </div>
        </dl>
      </div>
    </section>
  );
};
