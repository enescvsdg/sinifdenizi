// Builds the small WebP files and the app icons the app loads from the PNG
// masters in assets-src/. Run after changing a master or a crop below:
// npm run sprites
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const source = (file: string) =>
  new URL(`../assets-src/${file}`, import.meta.url).pathname;
const output = (file: string) =>
  new URL(`../public/assets/${file}`, import.meta.url).pathname;

type Crop = {
  file: string;
  box: readonly [x: number, y: number, width: number, height: number];
  /** Polygon in master coordinates that cuts away a neighbour's fin. */
  clip?: string;
};

const reef = "creatures-original-01.png",
  ocean = "creatures-original-02.png",
  explorer = "creatures-original-03.png",
  variety = "creatures-original-04.png",
  special = "creatures-original-05.png";

// Measured boxes include fins and tentacles that reach outside the nominal
// 512 px atlas cells. IDs 0–11 keep their species for saved classrooms.
const creatures: Record<number, Crop> = {
  0: { file: reef, box: [15, 80, 505, 360] },
  1: { file: reef, box: [522, 99, 524, 326] },
  2: { file: reef, box: [1067, 27, 454, 434] },
  3: {
    file: reef,
    box: [12, 500, 506, 467],
    clip: "12,500 518,500 518,656 480,656 480,775 518,775 518,825 480,845 480,967 12,967",
  },
  4: {
    file: reef,
    box: [500, 444, 536, 554],
    clip: "500,444 1036,444 1036,998 500,998 500,840 520,820 520,778 500,768",
  },
  5: { file: reef, box: [1060, 517, 468, 447] },
  6: { file: ocean, box: [137, 25, 306, 496] },
  7: { file: ocean, box: [492, 24, 542, 439] },
  8: { file: ocean, box: [1026, 108, 491, 385] },
  9: { file: ocean, box: [15, 562, 535, 359] },
  10: { file: ocean, box: [552, 501, 499, 513] },
  11: { file: ocean, box: [1048, 489, 451, 535] },
  12: {
    file: explorer,
    box: [30, 50, 462, 452],
    clip: "30,50 470,50 470,275 492,295 492,502 30,502",
  },
  // The hammerhead was redrawn on its own to make the head shape clear; the
  // first drawing in the explorer atlas is kept but not used.
  13: { file: "creature-hammerhead-original.png", box: [0, 0, 1536, 1024] },
  14: {
    file: explorer,
    box: [1013, 95, 521, 373],
    clip: "1013,95 1534,95 1534,468 1013,468 1013,350 1030,330 1030,210 1013,190",
  },
  15: { file: explorer, box: [0, 530, 515, 381] },
  16: { file: explorer, box: [517, 530, 487, 386] },
  17: { file: explorer, box: [1016, 567, 520, 379] },
  18: { file: variety, box: [8, 90, 516, 384] },
  19: { file: variety, box: [544, 39, 454, 449] },
  20: { file: variety, box: [1003, 86, 533, 371] },
  21: { file: variety, box: [20, 640, 514, 223] },
  22: { file: variety, box: [533, 584, 473, 318] },
  23: { file: variety, box: [1012, 578, 508, 363] },
  24: { file: special, box: [4, 70, 533, 409] },
  25: { file: special, box: [547, 55, 454, 436] },
  // The six miniature fish form one selectable school.
  26: { file: special, box: [1023, 52, 490, 421] },
  27: { file: special, box: [6, 486, 515, 482] },
  28: { file: special, box: [510, 518, 522, 451] },
  29: { file: special, box: [1034, 486, 491, 491] },
};

// A swimming creature is at most 160 CSS px wide (full screen), so 320 px
// stays sharp on high-density screens.
const creatureEdge = 320;
const webp = { quality: 78, alphaQuality: 82, effort: 6 } as const;

async function cut(crop: Crop) {
  const [left, top, width, height] = crop.box;
  const region = await sharp(source(crop.file))
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  if (!crop.clip) return region;
  const points = crop.clip
    .split(" ")
    .map((point) => point.split(",").map(Number))
    .map(([x, y]) => `${x - left},${y - top}`)
    .join(" ");
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><polygon points="${points}"/></svg>`;
  return sharp(region)
    .composite([{ input: Buffer.from(mask), blend: "dest-in" }])
    .png()
    .toBuffer();
}

await mkdir(output("creatures"), { recursive: true });
await mkdir(output("decor"), { recursive: true });
for (const [id, crop] of Object.entries(creatures)) {
  const [, , width, height] = crop.box;
  const scale = Math.min(1, creatureEdge / Math.max(width, height));
  await sharp(await cut(crop))
    .resize(Math.round(width * scale), Math.round(height * scale))
    .webp(webp)
    .toFile(output(`creatures/${id}.webp`));
}
// decorations.png is a 3 × 3 grid of 418 px cells, in decorNames order.
for (let i = 0; i < 9; i++) {
  await sharp(source("decorations.png"))
    .extract({
      left: (i % 3) * 418,
      top: Math.floor(i / 3) * 418,
      width: 418,
      height: 418,
    })
    .webp(webp)
    .toFile(output(`decor/${i}.webp`));
}
await sharp(source("aquarium.png"))
  .webp({ quality: 80, effort: 6 })
  .toFile(output("aquarium.webp"));

// App icons: the clownfish on the brand-guide blue tile. `rounded` icons
// are shown as they are (browser tab); the others fill the square so that
// iOS and Android can cut their own shape, keeping the fish in the middle.
const clownfish = await cut(creatures[0]);
async function icon(file: string, size: number, rounded: boolean) {
  const radius = rounded ? size * 0.22 : 0;
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#0b6ef3"/>
    </linearGradient></defs>
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#sea)"/>
    <circle cx="${size * 0.78}" cy="${size * 0.22}" r="${size * 0.05}" fill="#fff" fill-opacity=".55"/>
    <circle cx="${size * 0.86}" cy="${size * 0.36}" r="${size * 0.03}" fill="#fff" fill-opacity=".45"/>
  </svg>`;
  const fishWidth = Math.round(size * (rounded ? 0.8 : 0.62));
  const fish = await sharp(clownfish)
    .resize({ width: fishWidth })
    .png()
    .toBuffer();
  const { height = 0 } = await sharp(fish).metadata();
  await sharp(Buffer.from(tile))
    .composite([
      {
        input: fish,
        left: Math.round((size - fishWidth) / 2),
        top: Math.round((size - height) / 2 + size * 0.03),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(file);
}
const app = (file: string) =>
  new URL(`../app/${file}`, import.meta.url).pathname;
await mkdir(output("../icons"), { recursive: true });
await icon(app("icon.png"), 64, true);
await icon(app("apple-icon.png"), 180, false);
await icon(output("../icons/icon-192.png"), 192, true);
await icon(output("../icons/icon-512.png"), 512, true);
await icon(output("../icons/icon-maskable-512.png"), 512, false);
console.log("Sprites and icons written to public/ and app/.");
