"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Expand, Minimize, Pause, Play, MousePointer2, X } from "lucide-react";
import { Student, level } from "@/lib/model";
import { decorSlots } from "@/lib/decor-slots";
import {
  createSwimmers,
  stepSwimmers,
  swimProfile,
  type Swimmer,
} from "@/lib/swimming";
import { Fish, Decor, asset } from "./sprites";
import { OceanAtmosphere } from "./ocean-atmosphere";
import "@/app/ocean-motion.css";

export default function Aquarium({
  students,
  decorations,
  onSelect,
  feeding = 0,
  compact = false,
}: {
  students: Student[];
  /** Unlocked decorations to show, each in its own slot. */
  decorations: number[];
  onSelect: (s: Student) => void;
  feeding?: number;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const swimmers = useRef<(Swimmer & { id: string })[]>([]);
  const elapsed = useRef(0);
  const box = useRef({ width: 1000, height: 600 });
  // Last transforms written per fish: unchanged values are not rewritten.
  const written = useRef(new Map<string, [string, string]>());
  const sprites = useRef(new Map<string, HTMLElement | null>());
  const draw = useRef(() => {});
  // What is left of the latest meal, in milliseconds of running time.
  const meal = useRef({ feeding: 0, left: 0 });
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [full, setFull] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [eaten, setEaten] = useState(0);
  const food = feeding > eaten;
  const stopped = paused || reducedMotion || hidden;

  useEffect(() => {
    const previous = new Map(swimmers.current.map((fish) => [fish.id, fish]));
    const starts = createSwimmers(
      students.length,
      students.map((s) => s.fish),
    );
    swimmers.current = students.map((s, i) => ({
      ...(previous.get(s.id) || starts[i]),
      id: s.id,
      species: s.fish,
    }));
  }, [students]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReducedMotion(media.matches);
    const visibility = () => setHidden(document.hidden);
    preference();
    visibility();
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    const size = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      box.current = { width, height };
      root.current?.style.setProperty("--ocean-width", `${width}px`);
      root.current?.style.setProperty("--ocean-height", `${height}px`);
      // Positions are in pixels, so a paused aquarium needs a redraw too.
      draw.current();
    });
    if (root.current) size.observe(root.current);
    return () => {
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
      size.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!food || stopped) return;
    if (meal.current.feeding !== feeding)
      meal.current = { feeding, left: 2600 };
    const started = performance.now();
    const timer = window.setTimeout(() => setEaten(feeding), meal.current.left);
    return () => {
      clearTimeout(timer);
      meal.current.left = Math.max(
        0,
        meal.current.left - (performance.now() - started),
      );
    };
  }, [food, feeding, stopped]);

  useEffect(() => {
    let frame = 0;
    let last: number | null = null;
    // One transform per fish and one per sprite each frame. Depth and size
    // never change while swimming, so they are set once per element.
    draw.current = () => {
      const { width, height } = box.current;
      for (const f of swimmers.current) {
        const el = nodes.current.get(f.id);
        if (!el) continue;
        const scale = (0.68 + f.depth * 0.15) * swimProfile(f.species).size;
        if (el.dataset.depth !== String(f.depth)) {
          el.dataset.depth = String(f.depth);
          el.style.zIndex = String(4 + f.depth);
        }
        const move = `translate3d(${(f.x * width).toFixed(1)}px, ${(f.y * height).toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        const tilt = Math.max(-8, Math.min(8, f.vy * 180));
        const turn = `scaleX(${f.facing.toFixed(3)}) rotate(${tilt.toFixed(1)}deg)`;
        const [lastMove, lastTurn] = written.current.get(f.id) ?? [];
        if (move !== lastMove) el.style.transform = move;
        if (turn !== lastTurn) {
          let sprite = sprites.current.get(f.id);
          if (!sprite?.isConnected) {
            sprite = el.querySelector<HTMLElement>(".fish-sprite");
            sprites.current.set(f.id, sprite);
          }
          if (sprite) sprite.style.transform = turn;
        }
        written.current.set(f.id, [move, turn]);
      }
    };
    const paint = (now: number) => {
      // No hidden-tab catch-up and no simulation reset when pausing/resuming.
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!document.hidden) {
        elapsed.current += dt;
        const { width, height } = box.current;
        stepSwimmers(
          swimmers.current,
          dt,
          elapsed.current,
          width / Math.max(1, height),
        );
        draw.current();
      }
      frame = requestAnimationFrame(paint);
    };
    written.current.clear();
    draw.current();
    if (!stopped) frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [stopped, students]);

  useEffect(() => {
    const handler = () => setFull(document.fullscreenElement === root.current);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
    };
    document.addEventListener("fullscreenchange", handler);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      window.removeEventListener("keydown", esc);
    };
  }, []);
  async function fullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (full) {
      setFull(false);
      return;
    }
    try {
      if (!root.current?.requestFullscreen) {
        setFull(true);
        return;
      }
      await root.current.requestFullscreen();
    } catch {
      setFull(true);
    }
  }

  return (
    <div
      ref={root}
      className={`aquarium living-ocean ${compact ? "compact" : ""} ${full ? "expanded" : ""}`}
      data-motion={stopped ? "paused" : "running"}
      style={{ backgroundImage: `url(${asset("aquarium.webp")})` }}
    >
      <div className="aquarium-caption">
        <span className="live-dot" /> CANLI SINIF DENİZİ{" "}
        <span className="aquarium-caption-separator">/</span> {students.length}{" "}
        arkadaş, bir deniz
      </div>
      <OceanAtmosphere compact={compact} />
      {decorations.map((d) => {
        const slot = decorSlots[d];
        return (
          <Decor
            key={d}
            type={d}
            className={`scene-decor ${d === 0 ? "living-kelp" : d === 2 ? "living-coral" : d === 7 ? "living-jelly" : ""}`}
            style={{
              left: `${slot.left}%`,
              width: `${slot.width}%`,
              bottom: `${slot.bottom}%`,
              zIndex: 2,
              animationDelay: `-${d * 2.3}s`,
            }}
          />
        );
      })}
      {students.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            if (el) nodes.current.set(s.id, el);
            else nodes.current.delete(s.id);
          }}
          className="swimmer"
          data-species={s.fish}
          aria-label={`${s.name}, ${level(s.xp)}. seviye, öğrenci kartını aç`}
          onClick={() => onSelect(s)}
          onMouseEnter={() => setHover(s.id)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(s.id)}
          onBlur={() => setHover(null)}
          style={
            {
              width: compact ? "12%" : students.length > 30 ? "8%" : "10%",
              "--swim-delay": `-${i * 0.7}s`,
            } as CSSProperties
          }
        >
          <span className={`swimmer-body swim-${swimProfile(s.fish).style}`}>
            <Fish type={s.fish} />
          </span>
          {hover === s.id && (
            <span className="fish-label">
              {s.name}
              <small>Seviye {level(s.xp)}</small>
            </span>
          )}
        </button>
      ))}
      {food &&
        Array.from({ length: 30 }, (_, i) => (
          <i
            key={`${feeding}-${i}`}
            className="food"
            aria-hidden="true"
            style={{
              left: `${10 + ((i * 19) % 80)}%`,
              animationDelay: `${(i % 7) * 0.12}s`,
            }}
          />
        ))}
      <div className="aquarium-bottom">
        <span>
          <MousePointer2 size={14} /> Bir balığa dokun, hikâyesini keşfet
        </span>
        <div>
          <button
            aria-label={paused ? "Yüzmeyi sürdür" : "Yüzmeyi duraklat"}
            aria-pressed={paused}
            title={
              reducedMotion
                ? "Cihazınızın azaltılmış hareket tercihi açık"
                : paused
                  ? "Denizdeki hareketi sürdür"
                  : "Denizdeki tüm hareketi duraklat"
            }
            onClick={() => setPaused(!paused)}
          >
            {paused || reducedMotion ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <button
            onClick={fullscreen}
            aria-label={full ? "Tam ekrandan çık" : "Tam ekran"}
          >
            {full ? <Minimize size={17} /> : <Expand size={17} />}
            <span>{full ? "Küçült" : "Tam ekran"}</span>
          </button>
        </div>
      </div>
      {full && (
        <button
          className="fullscreen-exit icon-button"
          aria-label="Tam ekrandan çık"
          onClick={fullscreen}
        >
          <X />
        </button>
      )}
    </div>
  );
}
