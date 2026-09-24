import type { CSSProperties } from "react";
import { getCreatureArt } from "@/lib/creature-art";
export const asset = (name: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/${name}`;
export function Fish({
  type = 0,
  className = "",
  style,
}: {
  type?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const art = getCreatureArt(type);
  if (!art) return null;
  return (
    <img
      src={asset(art)}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`fish-sprite ${className}`}
      style={style}
    />
  );
}
export function Decor({
  type,
  className = "",
  style,
}: {
  type: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={asset(`decor/${type}.webp`)}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`decor-sprite ${className}`}
      style={style}
    />
  );
}
