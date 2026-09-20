'use client';
import { useEffect, useRef, useState } from 'react';
import { Expand, Minimize, Pause, Play, X, Waves } from 'lucide-react';
import { seedSwimmers, stepSwimmers, type Swimmer } from '@/lib/aquarium';
import { fishNames, type Student } from '@/lib/domain';
import { drawFish } from './fish-art';
export function Aquarium({
  students,
  decorLevel = 0,
  showNames = false,
  compact = false,
}: {
  students: Student[];
  decorLevel?: number;
  showNames?: boolean;
  compact?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    agents = useRef<Swimmer[]>([]);
  const [selected, setSelected] = useState<Student | null>(null),
    [paused, setPaused] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    const handler = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const c = el.getContext('2d');
    if (!c) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
      const r = el.getBoundingClientRect();
      width = r.width;
      height = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      agents.current = seedSwimmers(
        students.map((s) => s.id),
        width,
        height,
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    function render(now: number) {
      if (!c) return;
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (!paused && !reduced.matches && !document.hidden) {
        time += Math.min(dt, 0.04);
        stepSwimmers(agents.current, width, height, dt, time);
      }
      c.clearRect(0, 0, width, height);
      const bg = c.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#168db5');
      bg.addColorStop(0.45, '#09648b');
      bg.addColorStop(1, '#053647');
      c.fillStyle = bg;
      c.fillRect(0, 0, width, height);
      for (let i = 0; i < 5; i++) {
        c.fillStyle = '#b7faff07';
        c.beginPath();
        c.moveTo(width * (0.1 + i * 0.2), 0);
        c.lineTo(width * (0.3 + i * 0.2), height);
        c.lineTo(width * (0.08 + i * 0.2), height);
        c.lineTo(width * (0.17 + i * 0.2), 0);
        c.fill();
      }
      const glow = c.createRadialGradient(width * 0.5, -50, 10, width * 0.5, 0, width * 0.65);
      glow.addColorStop(0, '#b3fff743');
      glow.addColorStop(1, '#8bf4ff00');
      c.fillStyle = glow;
      c.fillRect(0, 0, width, height);
      for (let i = 0; i < 32; i++) {
        const bx = (i * 97) % Math.max(1, width),
          by = height - ((i * 51 + time * (7 + (i % 4) * 3)) % Math.max(1, height));
        c.strokeStyle = '#ccf9ff25';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(bx + Math.sin(time + i) * 5, by, 2 + (i % 4), 0, 7);
        c.stroke();
      }
      // Layered seabed and plants are original vector art, rendered at device resolution.
      for (let layer = 0; layer < 3; layer++) {
        c.fillStyle = ['#0d5865', '#17636b', '#397576'][layer];
        c.beginPath();
        c.moveTo(0, height);
        c.lineTo(0, height - 65 + layer * 17);
        c.bezierCurveTo(
          width * 0.3,
          height - 115 + layer * 22,
          width * 0.6,
          height - 15,
          width,
          height - 75 + layer * 16,
        );
        c.lineTo(width, height);
        c.fill();
      }
      for (let i = 0; i < 18; i++) {
        const x = (i * 177) % Math.max(1, width);
        for (let branch = 0; branch < 3; branch++) {
          c.strokeStyle = ['#389b8d', '#54b1a0', '#267d77'][branch];
          c.lineWidth = 5 + branch * 2;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(x, height - 18);
          c.bezierCurveTo(
            x - 20 + branch * 15,
            height - 60,
            x + Math.sin(time + i) * 9,
            height - 75,
            x + (branch - 1) * 18,
            height - 65 - (i % 5) * 12,
          );
          c.stroke();
        }
      }
      if (decorLevel >= 1)
        for (let i = 0; i < 7; i++) {
          const x = width * (0.08 + i * 0.15);
          c.strokeStyle = i % 2 ? '#ebae83' : '#e47b89';
          c.lineWidth = 7;
          c.lineCap = 'round';
          for (let b = -1; b <= 1; b++) {
            c.beginPath();
            c.moveTo(x, height - 30);
            c.bezierCurveTo(
              x,
              height - 65,
              x + b * 27,
              height - 55,
              x + b * 29,
              height - 83 - (i % 3) * 10,
            );
            c.stroke();
          }
        }
      if (decorLevel >= 2) {
        c.fillStyle = '#855d39';
        c.fillRect(width * 0.74, height - 87, 65, 42);
        c.strokeStyle = '#e6bf70';
        c.lineWidth = 5;
        c.strokeRect(width * 0.74, height - 87, 65, 42);
        c.fillStyle = '#ffe8a1';
        c.fillRect(width * 0.74 + 28, height - 76, 10, 14);
      }
      if (decorLevel >= 3) {
        c.fillStyle = '#284e55';
        c.beginPath();
        c.moveTo(width * 0.3, height - 100);
        c.lineTo(width * 0.48, height - 82);
        c.lineTo(width * 0.44, height - 40);
        c.lineTo(width * 0.32, height - 45);
        c.fill();
        c.fillRect(width * 0.38, height - 160, 7, 85);
      }
      if (decorLevel >= 4) {
        c.strokeStyle = '#658b90';
        c.lineWidth = 24;
        c.beginPath();
        c.arc(width * 0.58, height - 35, 57, Math.PI, 0);
        c.stroke();
      }
      if (decorLevel >= 5) {
        c.fillStyle = '#7ba7ae';
        c.fillRect(width * 0.1, height - 180, 25, 120);
        c.fillStyle = '#ffeaaa';
        c.fillRect(width * 0.1 - 3, height - 184, 31, 18);
      }
      if (decorLevel >= 6)
        for (let i = 0; i < 3; i++)
          drawFish(c, 'jellyfish', width * (0.3 + i * 0.18), height * 0.22, 0.5, 1, time, i);
      if (decorLevel >= 7) {
        c.fillStyle = '#789ea7';
        for (let i = 0; i < 3; i++) {
          c.fillRect(width * 0.83 + i * 24, height - 120 - (i % 2) * 30, 20, 80 + (i % 2) * 30);
          c.fillStyle = '#adbfc1';
          c.fillRect(width * 0.83 + i * 24 - 2, height - 124 - (i % 2) * 30, 24, 10);
          c.fillStyle = '#789ea7';
        }
      }
      for (const f of [...agents.current].sort((a, b) => a.depth - b.depth)) {
        const student = students.find((s) => s.id === f.id);
        if (!student) continue;
        c.globalAlpha = 0.7 + f.depth * 0.25;
        drawFish(
          c,
          student.fish_type,
          f.x,
          f.y,
          f.depth *
            Math.min(
              1,
              Math.max(0.35, Math.sqrt((width * height) / Math.max(1, students.length) / 18000)),
            ) *
            (1 + Math.min(student.level - 1, 10) * 0.018),
          f.vx,
          time,
          f.phase,
          student.level,
        );
        c.globalAlpha = 1;
      }
      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [students, decorLevel, paused]);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.current?.requestFullscreen();
    } catch {
      setError('Bu tarayıcı tam ekranı desteklemiyor.');
    }
  }
  return (
    <div className={`aquarium ${compact ? 'compact' : ''}`} ref={container}>
      <canvas
        ref={canvas}
        aria-label="Sınıfın serbestçe yüzen balıkları"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left,
            y = e.clientY - r.top;
          const hit = [...agents.current].reverse().find((f) => Math.hypot(f.x - x, f.y - y) < 48);
          setSelected(students.find((s) => s.id === hit?.id) || null);
        }}
      />
      {!compact && (
        <>
          <div className="aquarium-heading">
            <span className="live-dot" />
            <span>SINIFIMIZIN DENİZİ</span>
            <span className="aquarium-count">{students.length} deniz dostu</span>
          </div>
          <div className="aquarium-controls">
            <button
              aria-label={paused ? 'Animasyonu oynat' : 'Animasyonu duraklat'}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              aria-label={fullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
              onClick={toggleFullscreen}
            >
              {fullscreen ? <Minimize size={18} /> : <Expand size={18} />}
            </button>
          </div>
          <div className="aquarium-bottom">
            <Waves size={18} />
            <span>
              {students.length
                ? 'Bir balığa dokun, hikâyesini keşfet.'
                : 'İlk öğrenciyi ekleyerek denizini canlandır.'}
            </span>
            <span className="aquarium-depth">BİRLİKTE BÜYÜYORUZ</span>
          </div>
          {selected && (
            <div className="fish-card" role="status">
              <button className="close" aria-label="Kartı kapat" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
              <span className="eyebrow">{fishNames[selected.fish_type]}</span>
              <h3>{showNames ? selected.name : 'Deniz dostu'}</h3>
              <p>
                Seviye {selected.level} · {selected.xp} XP · {selected.feed} yem
              </p>
              <progress value={selected.xp % 100} max={100} />
            </div>
          )}
          <details className="fish-list">
            <summary>Balık seç</summary>
            <div>
              {students.map((s, i) => (
                <button key={s.id} onClick={() => setSelected(s)}>
                  {showNames ? s.name : `Deniz dostu ${i + 1}`} · {fishNames[s.fish_type]}
                </button>
              ))}
            </div>
          </details>
          {error && <p className="notice">{error}</p>}
        </>
      )}
    </div>
  );
}
