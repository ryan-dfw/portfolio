// Converts every PNG or JPEG dropped in public/png_in into two WebPs in public/shots,
// then moves the PNG out of the way:
//   png_in/name.png → shots/name.webp        (full size, opened when a screenshot is clicked)
//                   → shots/name_thumb.webp  (cards and the gallery)
//                   → deleteme/shots/name.png
//
// Name the files what they should be called first (e.g. steelwise01.png).
//
// Run: npm run shots
//
// Output is deterministic: the same PNG gives byte-identical WebPs as long as
// sharp stays pinned (exact version in package.json) and these settings don't change.

import { mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INBOX = "public/png_in";
const SHOTS = "public/shots";
const TRASH = "deleteme/shots";

// longest edge in px, WebP quality 0–100
const FULL = { edge: 3200, quality: 82 };
const THUMB = { edge: 1600, quality: 78 };

const encode = (input, { edge, quality }, out) =>
  sharp(input)
    .rotate() // apply EXIF orientation (phone JPEGs), then drop it
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(out); // sharp drops metadata unless asked, so nothing time-dependent is written

const exists = (p) => stat(p).then(() => true, () => false);

const pngs = (await readdir(INBOX).catch(() => [])).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();

if (pngs.length === 0) {
  console.log(`No PNGs or JPEGs in ${INBOX}.`);
  process.exit(0);
}

await mkdir(TRASH, { recursive: true });
await mkdir(SHOTS, { recursive: true });

for (const file of pngs) {
  const src = path.join(INBOX, file);
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);

  const full = await encode(src, FULL, path.join(SHOTS, `${base}.webp`));
  const thumb = await encode(src, THUMB, path.join(SHOTS, `${base}_thumb.webp`));

  // never overwrite an older PNG of the same name in the trash
  let dest = path.join(TRASH, file);
  for (let n = 2; await exists(dest); n++) dest = path.join(TRASH, `${base}-${n}${ext}`);
  await rename(src, dest);

  const kb = (b) => `${Math.round(b / 1024)} KB`;
  console.log(
    `${file} → ${base}.webp ${full.width}×${full.height} ${kb(full.size)}, ` +
      `${base}_thumb.webp ${thumb.width}×${thumb.height} ${kb(thumb.size)}`,
  );
}
