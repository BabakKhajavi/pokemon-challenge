export const formatPokemonNumber = (urlOrId: string | number): string => {
  let idString = '';

  if (typeof urlOrId === 'number') {
    idString = String(urlOrId);
  } else {
    const match = urlOrId.match(/\/(\d+)\/?$/);
    idString = match ? match[1] : urlOrId.trim();
  }

  // Ensure it's padded to 3 digits
  return idString.padStart(3, '0');
};