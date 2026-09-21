import { useId, type CSSProperties } from "react";
export const asset = (name: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/${name}`;
// Each creature has an individual atlas viewport: generated silhouettes are not
// confined to uniform cells. Tight viewports prevent neighbouring fin fragments.
const fishBounds = [
  [0, 58, 360, 248],
  [365, 50, 365, 263],
  [755, 0, 334, 327],
  [1116, 55, 332, 269],
  [0, 304, 384, 385],
  [391, 392, 345, 250],
  [797, 330, 252, 357],
  [1013, 365, 435, 279],
  [0, 695, 390, 331],
  [385, 694, 400, 284],
  [785, 688, 366, 350],
  [1168, 655, 280, 417],
];
export function Fish({
  type = 0,
  className = "",
  style,
}: {
  type?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const bounds = fishBounds[type];
  const clip = useId();
  if (!bounds) return null;
  const shape =
    type === 6
      ? "797,330 1049,330 1049,480 1000,500 1000,687 797,687"
      : type === 7
        ? "1060,365 1448,365 1448,644 1013,644 1013,575 1080,520"
        : null;
  return (
    <svg
      aria-hidden="true"
      className={`fish-sprite ${className}`}
      style={style}
      viewBox={bounds.join(" ")}
    >
      <defs>
        <clipPath id={clip}>
          {shape ? (
            <polygon points={shape} />
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
        href={asset("creatures.png")}
        width="1448"
        height="1086"
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
