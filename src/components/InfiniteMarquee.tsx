import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface InfiniteMarqueeProps {
  position?: "top" | "bottom";
  direction?: "left" | "right";
  className?: string;
  speedSeconds?: number;
}

const PHRASES = [
  "The future depends on the past, even if we don’t get to see it.",
  "El futuro depende del pasado, aunque no lleguemos a verlo.",
  "L'avenir dépend du passé, même si nous ne pouvons pas le voir.",
  "未来は過去に依存している。たとえそれを目にできなくても。",
  "未来取决于过去，即使我们无法看到它。",
];

export function InfiniteMarquee({
  position = "top",
  direction = "left",
  className = "",
  speedSeconds = 48,
}: InfiniteMarqueeProps) {
  const reduced = usePrefersReducedMotion();
  const dirClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  const sequence = PHRASES.map((text, i) => (
    <span key={i} className="flex items-center">
      <span className="px-6 whitespace-nowrap">{text.toUpperCase()}</span>
      {i !== PHRASES.length - 1 && <span className="opacity-30">—</span>}
    </span>
  ));

  return (
    <div
      data-marquee={position}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 z-[3] overflow-hidden bg-night-bg/60 backdrop-blur-[2px] ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
    >
      <div
  className={`marquee relative flex w-[200%] select-none text-[11px] sm:text-[12px] md:text-sm lg:text-base leading-none uppercase tracking-wide text-night-subtle opacity-40 ${
          reduced ? "" : dirClass
        } ${className}`}
        style={{ ["--marquee-duration" as any]: `${speedSeconds}s` }}
      >
        <div className="flex shrink-0 min-w-[50%] whitespace-nowrap">
          {sequence}
        </div>
        <div className="flex shrink-0 min-w-[50%] whitespace-nowrap" aria-hidden="true">
          {sequence}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night-bg to-transparent" />
    </div>
  );
}

export default InfiniteMarquee;
