export type Swimmer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  phase: number;
};
export function createSwimmers(count: number): Swimmer[] {
  let seed = 42;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const fish: Swimmer[] = [];
  for (let i = 0; i < count; i++) {
    let best = { x: 0.5, y: 0.4 },
      distance = -1;
    // Best-candidate distribution avoids repeated rows or overlapping starts.
    for (let sample = 0; sample < 32; sample++) {
      const candidate = { x: 0.08 + random() * 0.84, y: 0.14 + random() * 0.6 };
      const nearest = fish.length
        ? Math.min(
            ...fish.map((f) =>
              Math.hypot(f.x - candidate.x, f.y - candidate.y),
            ),
          )
        : 1;
      if (nearest > distance) {
        best = candidate;
        distance = nearest;
      }
    }
    fish.push({
      ...best,
      vx: (i % 2 ? 1 : -1) * (0.019 + (i % 4) * 0.003),
      vy: 0,
      depth: i % 3,
      phase: i * 2.7,
    });
  }
  return fish;
}
export function stepSwimmers(fish: Swimmer[], dt: number, time: number) {
  const delta = Math.min(Math.max(dt, 0), 0.04);
  const forces = fish.map((a) => {
    let ax = Math.sin(time * 0.3 + a.phase) * 0.003,
      ay = Math.sin(time * 0.5 + a.phase) * 0.003;
    for (const b of fish) {
      if (a === b) continue;
      const dx = a.x - b.x,
        dy = a.y - b.y,
        d = Math.hypot(dx, dy);
      if (d < 0.11 && d > 0.0001) {
        const strength = (0.11 - d) * (a.depth === b.depth ? 0.22 : 0.12);
        ax += (dx / d) * strength;
        ay += (dy / d) * strength;
      }
    }
    if (a.x < 0.09) ax += (0.09 - a.x) * 1.3;
    if (a.x > 0.91) ax -= (a.x - 0.91) * 1.3;
    if (a.y < 0.1) ay += (0.1 - a.y) * 0.6;
    if (a.y > 0.78) ay -= (a.y - 0.78) * 0.6;
    return { ax, ay };
  });
  fish.forEach((a, i) => {
    a.vx = Math.max(-0.038, Math.min(0.038, a.vx + forces[i].ax * delta));
    a.vy = Math.max(
      -0.023,
      Math.min(0.023, (a.vy + forces[i].ay * delta) * 0.997),
    );
    a.x = Math.max(0.025, Math.min(0.975, a.x + a.vx * delta));
    a.y = Math.max(0.05, Math.min(0.85, a.y + a.vy * delta));
  });
}
