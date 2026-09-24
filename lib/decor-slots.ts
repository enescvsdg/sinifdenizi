/**
 * Where each decoration stands in the aquarium (decorNames order), in % of
 * the aquarium's width (`left`, `width`) and height (`bottom`). Decorations
 * are square. Every one has its own place, so turning one on or off never
 * moves the others; the castle and the jellyfish sit farther back.
 */
export const decorSlots = [
  { left: 0, width: 11, bottom: -2 }, // kelp
  { left: 11, width: 12, bottom: -3 }, // rocks
  { left: 72, width: 13, bottom: -2 }, // coral
  { left: 44, width: 11, bottom: -1 }, // treasure chest
  { left: 24, width: 18, bottom: -2 }, // shipwreck
  { left: 87, width: 13, bottom: -1 }, // stone arch
  { left: 58, width: 12, bottom: -1 }, // lighthouse
  { left: 30, width: 12, bottom: 46 }, // glowing jellyfish
  { left: 46, width: 10, bottom: 30 }, // castle
] as const;
