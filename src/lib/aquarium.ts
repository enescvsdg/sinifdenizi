export type Swimmer = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  depth: number;
};
export function seedSwimmers(ids: string[], width: number, height: number): Swimmer[] {
  const columns = Math.max(1, Math.ceil(Math.sqrt((ids.length * width) / Math.max(height, 1))));
  const rows = Math.max(1, Math.ceil(ids.length / columns));
  return ids.map((id, i) => ({
    id,
    x: 50 + (((i % columns) + 0.5) / columns) * Math.max(1, width - 100),
    y: 55 + ((Math.floor(i / columns) + 0.5) / rows) * Math.max(1, height - 150),
    vx: (i % 2 ? -1 : 1) * (22 + (i % 5) * 4),
    vy: ((i % 3) - 1) * 6,
    phase: i * 2.4,
    depth: 0.65 + (i % 4) * 0.13,
  }));
}
export function stepSwimmers(
  fish: Swimmer[],
  width: number,
  height: number,
  dt: number,
  time: number,
) {
  dt = Math.min(Math.max(dt, 0), 0.04);
  const cell = 110;
  const grid = new Map<string, Swimmer[]>();
  for (const f of fish) {
    const key = `${Math.floor(f.x / cell)},${Math.floor(f.y / cell)}`;
    const bucket = grid.get(key) || [];
    bucket.push(f);
    grid.set(key, bucket);
  }
  for (const f of fish) {
    let ax = 0,
      ay = Math.sin(time * 0.7 + f.phase) * 7;
    const gx = Math.floor(f.x / cell),
      gy = Math.floor(f.y / cell);
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (const b of grid.get(`${gx + x},${gy + y}`) || []) {
          if (b === f) continue;
          const dx = f.x - b.x,
            dy = f.y - b.y,
            d = Math.hypot(dx, dy);
          if (d < 90) {
            if (d < 0.01) {
              ax += Math.cos(f.phase) * 60;
              ay += Math.sin(f.phase) * 60;
            } else {
              const force = ((90 - d) / 90) * 75;
              ax += (dx / d) * force;
              ay += (dy / d) * force;
            }
          }
        }
    const margin = Math.min(90, width / 4);
    if (f.x < margin) ax += (margin - f.x) * 1.1;
    if (f.x > width - margin) ax -= (f.x - width + margin) * 1.1;
    const bottom = Math.max(80, height - 100);
    if (f.y < 70) ay += (70 - f.y) * 1.4;
    if (f.y > bottom) ay -= (f.y - bottom) * 1.4;
    f.vx += ax * dt;
    f.vy += ay * dt;
    const speed = Math.hypot(f.vx, f.vy);
    if (speed > 48) {
      f.vx = (f.vx / speed) * 48;
      f.vy = (f.vy / speed) * 48;
    } else if (speed < 16) {
      f.vx += Math.cos(f.phase) * 6 * dt;
    }
    f.x = Math.max(25, Math.min(width - 25, f.x + f.vx * dt));
    f.y = Math.max(35, Math.min(height - 65, f.y + f.vy * dt));
  }
}
