import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    try {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } catch {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);
  return reduced;
}

function SolarSystemBG({ enabled = true }: { enabled?: boolean }) {
  const prefersReduced = usePrefersReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number>(0);
  const lastRef = React.useRef<number>(0);

  type Planet = { a: number; b: number; r: number; speed: number; phase: number; alpha: number };
  const planetsRef = React.useRef<Planet[]>([]);
  type Star = { x: number; y: number; size: number; tw: number; phase: number };
  const starsRef = React.useRef<Star[]>([]);
  const centerRef = React.useRef<{ x: number; y: number; sunR: number }>({ x: 0, y: 0, sunR: 60 });

  const setup = () => {
    const c = canvasRef.current;
    if (!c) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;

    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Place the sun a bit above the reading line to avoid competing with text.
    const sunR = Math.max(40, Math.min(90, Math.min(w, h) * 0.08));
    const cx = w * 0.5;
    const cy = h * 0.24; // was 0.23–0.28; adjust if needed
    centerRef.current = { x: cx, y: cy, sunR };

    // Planets: elliptical orbits with slightly different speeds
    const orbits = 6; // tweak 3–5
    const base = sunR * 1.7;
    planetsRef.current = Array.from({ length: orbits }, (_, i) => {
      const a = base + i * sunR * 0.9;      // major axis
      const b = a * 0.8;                    // minor axis (ellipse)
      const r = 2.0 + i * 0.9;              // planet radius
      const speed = 0.12 / (i + 1);         // radians per second
      const phase = Math.random() * Math.PI * 2;
      const alpha = 0.55 - i * 0.08;        // more distant = lighter
      return { a, b, r, speed, phase, alpha };
    });

    // Distant stars (do not fall—only twinkle & tiny parallax drift)
    const starCount = Math.floor((w * h) * 0.00016); // subtle but visible
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() < 0.20 ? 1.6 : 1.1,
      tw: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));
  };

  React.useEffect(() => {
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  React.useEffect(() => {
    if (!enabled || prefersReduced) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const { x: cx, y: cy, sunR } = centerRef.current;

    const tick = (t: number) => {
      const dt = Math.min(64, t - (lastRef.current || t));
      lastRef.current = t;

      const w = c.width / (window.devicePixelRatio || 1);
      const h = c.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // 1) Stars (twinkle + tiny parallax)
      for (const s of starsRef.current) {
        // gentle horizontal drift
        s.x += 0.005 * (dt / 16);
        if (s.x > w) s.x -= w;

        const alpha = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tw + s.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2) Sun (soft radial gradient)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 1.4);
      g.addColorStop(0, "rgba(255, 210, 140, 0.35)");
      g.addColorStop(1, "rgba(255, 210, 140, 0.00)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 3) Orbits (thin, faint ellipses)
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.setLineDash([2, 8]); // dotted, very light
      for (const p of planetsRef.current) {
        ctx.beginPath();
        (ctx as any).ellipse?.(cx, cy, p.a, p.b, 0, 0, Math.PI * 2);
        // fallback if ellipse is not supported
        if (!(ctx as any).ellipse) {
          ctx.arc(cx, cy, (p.a + p.b) / 2, 0, Math.PI * 2);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 4) Planets (tiny dots orbiting)
      for (const p of planetsRef.current) {
        p.phase += p.speed * (dt / 1000); // radians
        const x = cx + Math.cos(p.phase) * p.a;
        const y = cy + Math.sin(p.phase) * p.b;
        ctx.globalAlpha = Math.max(0.25, p.alpha);
        ctx.fillStyle = "#e5e5e5";
        ctx.shadowColor = "rgba(255,255,255,0.15)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, prefersReduced]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.5) 80%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.5) 80%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}


function Link({ href, children }: React.PropsWithChildren<{ href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
  className="underline decoration-stone-400/60 underline-offset-4 transition hover:decoration-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
    >
      {children}
    </a>
  );
}

export default function PersonalSite() {
  const [starsOn, _setStarsOn] = useState<boolean>(true);

  // Smooth scroll across the document
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    return () => document.documentElement.classList.remove("scroll-smooth");
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.2, 0.65, 0.2, 1] as [number, number, number, number] },
    viewport: { once: true },
  } as const;

  return (
    <div className="relative min-h-screen bg-night-bg text-night-text antialiased selection:bg-stone-200 selection:text-stone-900">
      {starsOn && <SolarSystemBG enabled={starsOn} />}

      {/* Soft vignette */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(255,255,255,0.05),transparent_60%)]" />

      {/* Skip link */}
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-stone-900 text-stone-50 rounded px-3 py-2">Skip to content</a>

      {/* Page content */}
  <main id="content" className="relative z-[2] mx-auto max-w-6xl px-6 pt-24 pb-32 md:pt-36 text-[28px] md:text-[40px] leading-[1.9]">
        <motion.header {...fadeIn}>
          <p className="text-pretty">
            I’m <strong className="font-semibold">Adrián Lorenzo</strong>, an AI researcher / engineer, currently Chief Research Officer at {" "}
    <Link href="https://www.theagilemonkeys.com">The Agile Monkeys</Link>.
          </p>
        </motion.header>

        <motion.section className="mt-12 space-y-6 text-pretty leading-relaxed" {...fadeIn}>
          <p>
            I’m interested in pushing AI toward more general intelligence by getting systems closer to the messy, real world—agentic architectures, multimodal reasoning and action, and simulation of environments and human interaction.
          </p>
        </motion.section>

        <motion.section className="mt-10" {...fadeIn}>
          <h2 className="sr-only">Lately I’ve</h2>
          <ul className="space-y-6">
            {[
              "built agentic, multimodal systems that perceive, plan, and act across workflows.",
              "improved models with data/feedback curation, instruction tuning and adapters, targeted fine-tuning, and reliability features like fallbacks, guardrails, and observability.",
              "led small research-engineering teams from idea to product with clear roadmaps tied to measurable impact.",
              "built high-performance information retrieval systems.",
            ].map((item, i) => (
              <li key={i} className="group relative pl-7 leading-relaxed">
                <span className="absolute left-0 top-3 text-stone-400 group-hover:text-stone-200 transition">•</span>
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section className="mt-12" {...fadeIn}>
          <p>
            If you want to talk, just say hi on {" "}
            <Link href="https://www.linkedin.com/in/adrianlorenzomelian/">LinkedIn</Link> {" · "}
            <Link href="https://twitter.com/adrianlorenzom">Twitter</Link>.
          </p>
        </motion.section>

      </main>
    </div>
  );
}
