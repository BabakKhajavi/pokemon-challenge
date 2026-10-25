import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/pokemon-artwork/v1');
const ids = JSON.parse(await readFile('src/features/pokemon/assets/artworkIds.json', 'utf8'));
const sizes = [160, 256];

await Promise.all(sizes.map((size) => mkdir(path.join(root, `card-${size}`), { recursive: true })));

let nextIndex = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (nextIndex < ids.length) {
    const id = ids[nextIndex++];
    const original = await readFile(path.join(root, `${id}.webp`));
    await Promise.all(sizes.map(async (size) => {
      const image = await sharp(original)
        .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78, effort: 5, alphaQuality: 90 })
        .toBuffer();
      await writeFile(path.join(root, `card-${size}`, `${id}.webp`), image);
    }));
  }
}));

process.stdout.write(`Generated ${ids.length} artwork files at each card size: ${sizes.join(', ')}px.\n`);
