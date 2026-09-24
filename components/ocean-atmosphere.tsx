import { memo, useId, type CSSProperties } from "react";
import { Fish } from "./sprites";

/** Decorative layers never intercept a student's fish or enter the tab order. */
export const OceanAtmosphere = memo(function OceanAtmosphere({
  compact = false,
}: {
  compact?: boolean;
}) {
  const pattern = useId();
  return (
    <div className="ocean-atmosphere" aria-hidden="true">
      <div className="ocean-surface">
        <i />
        <i />
      </div>
      <div className="ocean-sunlight">
        {Array.from({ length: 7 }, (_, i) => (
          <i
            key={i}
            className="ocean-shaft"
            style={
              {
                left: `${8 + i * 13}%`,
                width: `${5 + (i % 3) * 3}%`,
                "--shaft-angle": `${-21 + i * 3}deg`,
                animationDuration: `${13 + i * 2}s`,
                animationDelay: `-${i * 2.8}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <svg className="ocean-caustics" width="100%" height="100%">
        <defs>
          <pattern
            id={pattern}
            width="170"
            height="110"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-25 42Q10 8 55 24T147 14T203 40M-20 84Q18 50 54 69T142 71T200 100M40-15Q16 12 42 35T71 80T59 125M135-20Q153 7 129 31T119 76T145 130"
              fill="none"
              stroke="#d9ffff"
              strokeWidth="1.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pattern})`} />
      </svg>
      <div className="ocean-schools">
        {Array.from({ length: compact ? 2 : 4 }, (_, group) => (
          <div
            className={`ocean-school ${group % 2 ? "school-west" : ""}`}
            key={group}
            style={
              {
                top: `${21 + group * 12}%`,
                animationDuration: `${36 + group * 7}s`,
                animationDelay: `-${8 + group * 13}s`,
                opacity: 0.35 + (group % 2) * 0.12,
              } as CSSProperties
            }
          >
            <div className="ocean-school-members">
              {Array.from({ length: 6 }, (_, i) => (
                <Fish
                  key={i}
                  type={[1, 2, 0, 3][group]}
                  className="ocean-school-fish"
                  style={{
                    left: `${i * 20}px`,
                    top: `${Math.sin(i * 1.9) * 16}px`,
                    width: `${18 + (i % 3) * 5}px`,
                    animationDelay: `-${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ocean-particles">
        {Array.from({ length: compact ? 18 : 32 }, (_, i) => (
          <i
            className="ocean-mote"
            key={i}
            style={{
              left: `${(i * 31) % 100}%`,
              top: `${7 + ((i * 17) % 84)}%`,
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              animationDuration: `${12 + (i % 7) * 3}s`,
              animationDelay: `-${i * 1.3}s`,
            }}
          />
        ))}
      </div>
      {Array.from({ length: compact ? 12 : 22 }, (_, i) => (
        <i
          key={i}
          className="bubble ocean-bubble"
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            width: 3 + (i % 4) * 2,
            height: 3 + (i % 4) * 2,
            animationDelay: `-${i * 1.7}s`,
            animationDuration: `${13 + (i % 5) * 2}s`,
          }}
        />
      ))}
    </div>
  );
});
