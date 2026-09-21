"use client";
import { useEffect, useRef, useState } from "react";
import { Expand, Minimize, Pause, Play, MousePointer2, X } from "lucide-react";
import { Student, level, decorThresholds } from "@/lib/model";
import { createSwimmers, stepSwimmers } from "@/lib/swimming";
import { Fish, Decor, asset } from "./sprites";
export default function Aquarium({
  students,
  decorations,
  xp,
  onSelect,
  feeding = 0,
  compact = false,
}: {
  students: Student[];
  decorations: number[];
  xp: number;
  onSelect: (s: Student) => void;
  feeding?: number;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null),
    nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const [paused, setPaused] = useState(false),
    [full, setFull] = useState(false),
    [hover, setHover] = useState<string | null>(null),
    [food, setFood] = useState(false);
  useEffect(() => {
    if (!feeding) return;
    setFood(true);
    const t = setTimeout(() => setFood(false), 2600);
    return () => clearTimeout(t);
  }, [feeding]);
  useEffect(() => {
    const handler = () => setFull(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const fish = createSwimmers(students.length);
    let frame = 0,
      last = 0;
    const paint = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (!paused && !media.matches && !document.hidden)
        stepSwimmers(fish, dt, now / 1000);
      fish.forEach((f, i) => {
        const el = nodes.current[i];
        if (!el) return;
        el.style.left = `${f.x * 100}%`;
        el.style.top = `${f.y * 100}%`;
        el.style.zIndex = String(4 + f.depth);
        el.style.setProperty("--direction", String(f.vx < 0 ? -1 : 1));
        el.style.setProperty("--scale", String(0.67 + f.depth * 0.15));
        el.style.setProperty(
          "--tilt",
          `${Math.max(-9, Math.min(9, f.vy * 200))}deg`,
        );
      });
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [students.length, paused]);
  async function fullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    try {
      await root.current?.requestFullscreen();
    } catch {
      setFull(!full);
    }
  }
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return (
    <div
      ref={root}
      className={`aquarium ${compact ? "compact" : ""} ${full ? "expanded" : ""}`}
      style={{ backgroundImage: `url(${asset("aquarium.png")})` }}
    >
      <div className="aquarium-caption">
        <span className="live-dot" /> CANLI SINIF DENİZİ{" "}
        <span className="aquarium-caption-separator">/</span> {students.length}{" "}
        arkadaş, bir deniz
      </div>
      <div className="water-rays" />
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          className={`bubble ${paused ? "paused" : ""}`}
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            width: 4 + (i % 4) * 3,
            height: 4 + (i % 4) * 3,
            animationDelay: `-${i * 1.7}s`,
            animationDuration: `${11 + (i % 5)}s`,
          }}
        />
      ))}
      {decorations
        .filter((x) => xp >= decorThresholds[x])
        .map((d, i) => (
          <Decor
            key={d}
            type={d}
            className="scene-decor"
            style={{
              left: `${4 + ((i * 17) % 82)}%`,
              width: d === 4 ? "23%" : "15%",
              bottom: d === 7 ? "19%" : "-1%",
              zIndex: 2,
            }}
          />
        ))}
      {students.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className="swimmer"
          aria-label={`${s.name}, ${level(s.xp)}. seviye, öğrenci kartını aç`}
          onClick={() => onSelect(s)}
          onMouseEnter={() => setHover(s.id)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(s.id)}
          onBlur={() => setHover(null)}
          style={{
            width: compact ? "12%" : students.length > 30 ? "8%" : "10%",
            animationDelay: `-${i}s`,
          }}
        >
          <Fish type={s.fish} />
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
            key={i}
            className="food"
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
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={17} /> : <Pause size={17} />}
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
