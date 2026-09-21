export type SwimStyle = "cruise" | "dart" | "glide" | "hover" | "pulse" | "bottom";
export type Swimmer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  phase: number;
  species: number;
  facing: number;
  direction: number;
};

export function swimProfile(species: number) {
  let style: SwimStyle = "cruise";
  if ([1, 2, 16, 18, 20, 21, 22, 26, 28].includes(species)) style = "dart";
  if ([7, 8, 9, 13, 14, 29].includes(species)) style = "glide";
  if ([4, 5, 6, 25].includes(species)) style = "hover";
  if ([11, 17].includes(species)) style = "pulse";
  if ([10, 15, 19, 24].includes(species)) style = "bottom";
  const speeds = { cruise: 0.029, dart: 0.044, glide: 0.024, hover: 0.012, pulse: 0.011, bottom: 0.015 };
  return { style, speed: speeds[style], minY: style === "bottom" ? 0.61 : 0.16, maxY: style === "bottom" ? 0.81 : 0.73 };
}

export function createSwimmers(count: number, species: number[] = []): Swimmer[] {
  let seed = 42;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const fish: Swimmer[] = [];
  for (let i = 0; i < count; i++) {
    const kind = species[i] ?? i % 12;
    const profile = swimProfile(kind);
    let best = { x: 0.5, y: 0.4 }, distance = -1;
    // Best-candidate distribution leaves clear water between new arrivals.
    for (let sample = 0; sample < 40; sample++) {
      const candidate = { x: 0.09 + random() * 0.82, y: profile.minY + random() * (profile.maxY - profile.minY) };
      const nearest = fish.length ? Math.min(...fish.map((f) => Math.hypot((f.x - candidate.x) * 1.5, f.y - candidate.y))) : 1;
      if (nearest > distance) { best = candidate; distance = nearest; }
    }
    const direction = i % 2 ? 1 : -1;
    fish.push({ ...best, vx: direction * profile.speed * (0.8 + random() * 0.3), vy: 0, depth: i % 3, phase: i * 2.7, species: kind, facing: direction, direction });
  }
  return fish;
}

/** Advance only active simulation time. A resumed tab must not use wall-clock time. */
export function stepSwimmers(fish: Swimmer[], dt: number, time: number, aspect = 1.65) {
  if (!Number.isFinite(dt) || !Number.isFinite(time) || dt <= 0) return;
  const delta = Math.min(dt, 0.04);
  const safeAspect = Math.max(0.6, Math.min(4, aspect));
  const forces = fish.map((a, index) => {
    const profile = swimProfile(a.species);
    const pulse = Math.sin(time * (profile.style === "dart" ? 1.8 : 0.55) + a.phase);
    const targetSpeed = profile.speed * (1 + pulse * (profile.style === "dart" ? 0.3 : 0.12));
    let ax = (a.direction * targetSpeed - a.vx) * 0.42;
    let ay = Math.sin(time * 0.48 + a.phase) * (profile.style === "pulse" ? 0.011 : 0.0045);
    if (profile.style === "pulse") ay -= Math.max(0, Math.sin(time * 2 + a.phase)) * 0.003;
    for (let j = 0; j < fish.length; j++) {
      if (j === index) continue;
      const b = fish[j];
      const dx = (a.x - b.x) * safeAspect, dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      const spacing = a.depth === b.depth ? 0.17 : 0.115;
      if (distance < spacing) {
        // Coincident fish receive deterministic opposing directions, never NaN.
        const nx = distance > 0.00001 ? dx / distance : index < j ? -1 : 1;
        const ny = distance > 0.00001 ? dy / distance : index % 2 ? 0.5 : -0.5;
        const force = (1 - distance / spacing) ** 2 * 0.105;
        ax += nx * force / safeAspect;
        ay += ny * force;
      }
    }
    // Begin turning well before the glass; avoid abrupt wrapping or bouncing.
    if (a.x < 0.11) ax += (0.11 - a.x) * 1.8;
    if (a.x > 0.89) ax -= (a.x - 0.89) * 1.8;
    if (a.y < profile.minY) ay += (profile.minY - a.y) * 0.8;
    if (a.y > profile.maxY) ay -= (a.y - profile.maxY) * 0.8;
    return { ax, ay, speed: profile.speed };
  });
  fish.forEach((a, i) => {
    if (a.x < 0.1) a.direction = 1;
    if (a.x > 0.9) a.direction = -1;
    const maxSpeed = forces[i].speed * 1.55;
    a.vx = Math.max(-maxSpeed, Math.min(maxSpeed, a.vx + forces[i].ax * delta));
    a.vy = Math.max(-0.024, Math.min(0.024, (a.vy + forces[i].ay * delta) * Math.exp(-delta * 0.6)));
    a.x = Math.max(0.055, Math.min(0.945, a.x + a.vx * delta));
    a.y = Math.max(0.09, Math.min(0.84, a.y + a.vy * delta));
    const targetFacing = Math.abs(a.vx) > 0.003 ? Math.sign(a.vx) : a.direction;
    a.facing += (targetFacing - a.facing) * Math.min(1, delta * 5);
  });
}
