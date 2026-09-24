// Finished artwork per species, as files under public/assets. They are built
// from the PNG masters in assets-src/ by `npm run sprites`
// (scripts/build-sprites.ts), which also holds each species' crop.
// Only add an entry after its artwork is built and checked. IDs 0–11 keep
// their species identity for existing saved classrooms.
export const creatureArt: Readonly<Partial<Record<number, string>>> = {
  0: "creatures/0.webp",
  1: "creatures/1.webp",
  2: "creatures/2.webp",
  3: "creatures/3.webp",
  4: "creatures/4.webp",
  5: "creatures/5.webp",
  6: "creatures/6.webp",
  7: "creatures/7.webp",
  8: "creatures/8.webp",
  9: "creatures/9.webp",
  10: "creatures/10.webp",
  11: "creatures/11.webp",
  12: "creatures/12.webp",
  13: "creatures/13.webp",
  14: "creatures/14.webp",
  15: "creatures/15.webp",
  16: "creatures/16.webp",
  17: "creatures/17.webp",
  18: "creatures/18.webp",
  19: "creatures/19.webp",
  20: "creatures/20.webp",
  21: "creatures/21.webp",
  22: "creatures/22.webp",
  23: "creatures/23.webp",
  24: "creatures/24.webp",
  25: "creatures/25.webp",
  26: "creatures/26.webp",
  27: "creatures/27.webp",
  28: "creatures/28.webp",
  29: "creatures/29.webp",
};

export function getCreatureArt(id: number): string | undefined {
  return Number.isInteger(id) && id >= 0 ? creatureArt[id] : undefined;
}

export function hasCreatureArt(id: number): boolean {
  return getCreatureArt(id) !== undefined;
}
