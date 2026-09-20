import { describe, it, expect } from 'vitest';
import { levelForXp, decorForXp, summarize } from '../src/lib/domain';
import { taskSchema } from '../src/lib/validation';
import { seedSwimmers, stepSwimmers } from '../src/lib/aquarium';
describe('progression', () => {
  it('uses exact level and unlock boundaries', () => {
    expect([0, 99, 100, 250].map(levelForXp)).toEqual([1, 1, 2, 3]);
    expect([0, 299, 300, 749, 750, 9000].map(decorForXp)).toEqual([0, 0, 1, 1, 2, 7]);
  });
  it('handles an empty classroom without NaN', () => {
    expect(summarize({ students: [], assignments: [] })).toEqual({
      completed: 0,
      pending: 0,
      completion: 0,
      participation: 0,
      feed: 0,
    });
  });
  it('rejects tampered rewards and empty assignments', () => {
    const t = {
      class_id: '11111111-1111-4111-8111-111111111111',
      title: 'Okuma görevi',
      description: '',
      type: 'okuma',
      xp_reward: 40,
      feed_reward: 10,
      due_date: '2026-09-30',
      student_ids: ['22222222-2222-4222-8222-222222222222'],
    };
    expect(taskSchema.safeParse(t).success).toBe(true);
    for (const change of [
      { xp_reward: -1 },
      { xp_reward: 501 },
      { feed_reward: 1.5 },
      { student_ids: [] },
      { due_date: '2026-02-31' },
    ])
      expect(taskSchema.safeParse({ ...t, ...change }).success).toBe(false);
  });
});
describe('aquarium simulation', () => {
  it('keeps 40 swimmers finite and within bounds over five minutes', () => {
    const fish = seedSwimmers(
      Array.from({ length: 40 }, (_, i) => String(i)),
      1000,
      600,
    );
    for (let i = 0; i < 18000; i++) stepSwimmers(fish, 1000, 600, 1 / 60, i / 60);
    for (const f of fish) {
      expect(Number.isFinite(f.x + f.y + f.vx + f.vy)).toBe(true);
      expect(f.x).toBeGreaterThanOrEqual(25);
      expect(f.x).toBeLessThanOrEqual(975);
      expect(f.y).toBeGreaterThanOrEqual(35);
      expect(f.y).toBeLessThanOrEqual(535);
    }
  });
  it('separates nearby fish and clamps a background-tab time jump', () => {
    const fish = seedSwimmers(['a', 'b'], 1000, 600);
    Object.assign(fish[0], { x: 500, y: 300, vx: 0, vy: 0 });
    Object.assign(fish[1], { x: 510, y: 300, vx: 0, vy: 0 });
    for (let i = 0; i < 60; i++) stepSwimmers(fish, 1000, 600, 1 / 60, i / 60);
    expect(fish[1].x - fish[0].x).toBeGreaterThan(10);
    const old = fish[0].x;
    stepSwimmers(fish, 1000, 600, 100, 10);
    expect(Math.abs(fish[0].x - old)).toBeLessThan(3);
  });
});
