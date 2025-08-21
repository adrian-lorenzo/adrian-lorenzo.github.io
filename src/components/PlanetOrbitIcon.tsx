import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface PlanetOrbitIconProps {
  size?: number;
  className?: string;
  orbitDurationSeconds?: number;
}

export function PlanetOrbitIcon({
  size = 80,
  className = "",
  orbitDurationSeconds = 45,
}: PlanetOrbitIconProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative mx-auto text-stone-200/70 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="block"
        role="img"
        aria-hidden="true"
      >
        {/* Enlarged planet */}
        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Orbiting satellite (with surface irregularities) */}
        <g className={reduced ? "" : "orbit-spin"} style={{ animationDuration: `${orbitDurationSeconds}s` }}>
          <g transform="translate(50 8)">
            {/* Satellite body (bigger) */}
            <circle r="8" fill="currentColor" fillOpacity="0.92" />
            {/* Surface irregularities (craters / albedo variations) */}
            <circle r="2" cx="-2" cy="-1.4" fill="rgba(255,255,255,0.25)" />
            <circle r="1.3" cx="2.8" cy="1.2" fill="rgba(255,255,255,0.22)" />
            <circle r="1" cx="0.8" cy="-3" fill="rgba(255,255,255,0.32)" />
            <circle r="0.9" cx="-3" cy="2.2" fill="rgba(255,255,255,0.18)" />
            {/* Rim highlight */}
            <path d="M -6 0 A 6 6 0 0 1 6 -0.7" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" fill="none" />
          </g>
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-[2px]" />
    </div>
  );
}

export default PlanetOrbitIcon;
