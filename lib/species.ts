import { hasCreatureArt } from "./creature-art.ts";

export type SpeciesCategory = "small" | "large" | "special";
export type SpeciesDefinition = {
  id: number;
  name: string;
  category: SpeciesCategory;
  unlockXp: number;
  available: boolean;
};

// IDs 0–11 are permanent: existing version-2 classroom saves use these IDs.
const speciesRows: readonly Omit<SpeciesDefinition, "available">[] = [
  { id: 0, name: "Palyaço balığı", category: "small", unlockXp: 0 },
  { id: 1, name: "Mavi tang", category: "small", unlockXp: 0 },
  { id: 2, name: "Sarı tang", category: "small", unlockXp: 0 },
  { id: 3, name: "Kelebek balığı", category: "small", unlockXp: 0 },
  { id: 4, name: "Aslan balığı", category: "small", unlockXp: 0 },
  { id: 5, name: "Dikenli balon balığı", category: "small", unlockXp: 0 },
  { id: 6, name: "Denizatı", category: "special", unlockXp: 0 },
  { id: 7, name: "Manta vatoz", category: "large", unlockXp: 0 },
  { id: 8, name: "Deniz kaplumbağası", category: "large", unlockXp: 0 },
  { id: 9, name: "Beyaz uçlu köpekbalığı", category: "large", unlockXp: 0 },
  { id: 10, name: "Ahtapot", category: "special", unlockXp: 0 },
  { id: 11, name: "Denizanası", category: "special", unlockXp: 0 },
  { id: 12, name: "Melek balığı", category: "small", unlockXp: 0 },
  { id: 13, name: "Çekiçbaş köpekbalığı", category: "large", unlockXp: 0 },
  { id: 14, name: "Balina köpekbalığı", category: "large", unlockXp: 0 },
  { id: 15, name: "Orfoz", category: "large", unlockXp: 0 },
  { id: 16, name: "Papağan balığı", category: "small", unlockXp: 0 },
  { id: 17, name: "Mürekkep balığı", category: "special", unlockXp: 0 },
  { id: 18, name: "Mandarin balığı", category: "small", unlockXp: 0 },
  { id: 19, name: "Deniz yıldızı", category: "special", unlockXp: 0 },
  { id: 20, name: "Kılıç balığı", category: "large", unlockXp: 0 },
  { id: 21, name: "Barakuda", category: "large", unlockXp: 0 },
  { id: 22, name: "Mavi cerrah", category: "small", unlockXp: 0 },
  { id: 23, name: "Kutup balığı", category: "small", unlockXp: 0 },
  { id: 24, name: "Taş balığı", category: "small", unlockXp: 0 },
  { id: 25, name: "Aslan yavrusu", category: "small", unlockXp: 0 },
  { id: 26, name: "Renkli sürüler", category: "special", unlockXp: 0 },
  { id: 27, name: "Özel (Altın balık)", category: "special", unlockXp: 500 },
  { id: 28, name: "Efsane (Gökkuşağı)", category: "special", unlockXp: 1500 },
  { id: 29, name: "Efsane (Karanlık)", category: "special", unlockXp: 3000 },
];

// A species becomes selectable only when its own finished artwork is available.
// Do not substitute an unrelated creature for a missing species asset.
export const speciesDefinitions: readonly SpeciesDefinition[] = speciesRows.map(
  (fish) => ({ ...fish, available: hasCreatureArt(fish.id) }),
);

export const species = speciesDefinitions.map((fish) => fish.name);
export const catalogOrder = [
  0, 1, 2, 12, 4, 3, 5, 6, 7, 8, 9, 13, 14, 15, 16,
  17, 11, 18, 10, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
];
export const speciesFilters = [
  { id: "all", label: "Tümü" },
  { id: "small", label: "Küçük balıklar" },
  { id: "large", label: "Büyük balıklar" },
  { id: "special", label: "Özel türler" },
] as const;
export type SpeciesFilter = (typeof speciesFilters)[number]["id"];

export function canChooseSpecies(id: number, xp: number): boolean {
  return isSpeciesUnlocked(id, xp) && speciesDefinitions[id].available;
}

export function isSpeciesUnlocked(id: number, xp: number): boolean {
  const fish = speciesDefinitions[id];
  return Number.isInteger(id) && !!fish && Number.isFinite(xp) && xp >= fish.unlockXp;
}

function searchKey(text: string) {
  return text.toLocaleLowerCase("tr-TR").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").trim();
}

export function filterSpecies(filter: SpeciesFilter = "all", query = "") {
  const key = searchKey(query);
  return catalogOrder.map((id) => speciesDefinitions[id]).filter((fish) =>
    (filter === "all" || fish.category === filter) && searchKey(fish.name).includes(key),
  );
}
