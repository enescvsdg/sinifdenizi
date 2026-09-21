import { useId, type CSSProperties } from "react";
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
  const clip = useId();
  if (!art) return null;
  const bounds = art.viewBox;
  return (
    <svg
      aria-hidden="true"
      className={`fish-sprite ${className}`}
      style={style}
      viewBox={bounds.join(" ")}
    >
      <defs>
        <clipPath id={clip}>
          {art.clip?.kind === "polygon" ? (
            <polygon points={art.clip.points} />
          ) : art.clip?.kind === "path" ? (
            <path d={art.clip.d} />
          ) : (
            <rect
              x={bounds[0]}
              y={bounds[1]}
              width={bounds[2]}
              height={bounds[3]}
            />
          )}
        </clipPath>
      </defs>
      <image
        href={asset(art.image.file)}
        width={art.image.width}
        height={art.image.height}
        clipPath={`url(#${clip})`}
      />
    </svg>
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
    <span
      aria-hidden="true"
      className={`decor-sprite ${className}`}
      style={{
        backgroundImage: `url(${asset("decorations.png")})`,
        backgroundPosition: `${(type % 3) * 50}% ${Math.floor(type / 3) * 50}%`,
        ...style,
      }}
    />
  );
}
