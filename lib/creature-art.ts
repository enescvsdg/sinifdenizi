export type CreatureViewport = readonly [
  x: number,
  y: number,
  width: number,
  height: number,
];
export type CreatureClip =
  | { readonly kind: "polygon"; readonly points: string }
  | { readonly kind: "path"; readonly d: string };
export type CreatureArt = {
  /** Path relative to public/assets; use a new file for each finished atlas. */
  readonly image: {
    readonly file: string;
    readonly width: number;
    readonly height: number;
  };
  readonly viewBox: CreatureViewport;
  /** Omit to clip to the rectangular viewport. Coordinates are in atlas space. */
  readonly clip?: CreatureClip;
};

const reefAtlas = {
  file: "creatures-original-01.png",
  width: 1536,
  height: 1024,
} as const;
const oceanAtlas = {
  file: "creatures-original-02.png",
  width: 1536,
  height: 1024,
} as const;
const explorerAtlas = {
  file: "creatures-original-03.png",
  width: 1536,
  height: 1024,
} as const;
const varietyAtlas = {
  file: "creatures-original-04.png",
  width: 1536,
  height: 1024,
} as const;
const specialAtlas = {
  file: "creatures-original-05.png",
  width: 1536,
  height: 1024,
} as const;

// Only add an entry after its actual artwork is in public/assets and verified.
// IDs 0-11 keep their species identity for existing saved classrooms.
// These measured viewports include fins/tentacles outside the nominal atlas cells.
// Future art can use an individual image (viewBox [0, 0, width, height]) or an atlas.
export const creatureArt: Readonly<Partial<Record<number, CreatureArt>>> = {
  0: { image: reefAtlas, viewBox: [15, 80, 505, 360] },
  1: { image: reefAtlas, viewBox: [522, 99, 524, 326] },
  2: { image: reefAtlas, viewBox: [1067, 27, 454, 434] },
  3: {
    image: reefAtlas,
    viewBox: [12, 500, 506, 467],
    clip: {
      kind: "polygon",
      points: "12,500 518,500 518,656 480,656 480,775 518,775 518,825 480,845 480,967 12,967",
    },
  },
  4: {
    image: reefAtlas,
    viewBox: [500, 444, 536, 554],
    clip: {
      kind: "polygon",
      points: "500,444 1036,444 1036,998 500,998 500,840 520,820 520,778 500,768",
    },
  },
  5: { image: reefAtlas, viewBox: [1060, 517, 468, 447] },
  6: { image: oceanAtlas, viewBox: [137, 25, 306, 496] },
  7: { image: oceanAtlas, viewBox: [492, 24, 542, 439] },
  8: { image: oceanAtlas, viewBox: [1026, 108, 491, 385] },
  9: { image: oceanAtlas, viewBox: [15, 562, 535, 359] },
  10: { image: oceanAtlas, viewBox: [552, 501, 499, 513] },
  11: { image: oceanAtlas, viewBox: [1048, 489, 451, 535] },
  12: {
    image: explorerAtlas,
    viewBox: [30, 50, 462, 452],
    clip: {
      kind: "polygon",
      points: "30,50 470,50 470,275 492,295 492,502 30,502",
    },
  },
  13: {
    image: { file: "creature-hammerhead-original.png", width: 1536, height: 1024 },
    viewBox: [0, 0, 1536, 1024],
  },
  14: {
    image: explorerAtlas,
    viewBox: [1013, 95, 521, 373],
    clip: {
      kind: "polygon",
      points: "1013,95 1534,95 1534,468 1013,468 1013,350 1030,330 1030,210 1013,190",
    },
  },
  15: { image: explorerAtlas, viewBox: [0, 530, 515, 381] },
  16: { image: explorerAtlas, viewBox: [517, 530, 487, 386] },
  17: { image: explorerAtlas, viewBox: [1016, 567, 520, 379] },
  18: { image: varietyAtlas, viewBox: [8, 90, 516, 384] },
  19: { image: varietyAtlas, viewBox: [544, 39, 454, 449] },
  20: { image: varietyAtlas, viewBox: [1003, 86, 533, 371] },
  21: { image: varietyAtlas, viewBox: [20, 640, 514, 223] },
  22: { image: varietyAtlas, viewBox: [533, 584, 473, 318] },
  23: { image: varietyAtlas, viewBox: [1012, 578, 508, 363] },
  24: { image: specialAtlas, viewBox: [4, 70, 533, 409] },
  25: { image: specialAtlas, viewBox: [547, 55, 454, 436] },
  // The six miniature fish form one selectable school and share a viewport.
  26: { image: specialAtlas, viewBox: [1023, 52, 490, 421] },
  27: { image: specialAtlas, viewBox: [6, 486, 515, 482] },
  28: { image: specialAtlas, viewBox: [510, 518, 522, 451] },
  29: { image: specialAtlas, viewBox: [1034, 486, 491, 491] },
};

export function getCreatureArt(id: number): CreatureArt | undefined {
  return Number.isInteger(id) && id >= 0 ? creatureArt[id] : undefined;
}

export function hasCreatureArt(id: number): boolean {
  return getCreatureArt(id) !== undefined;
}
