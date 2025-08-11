import React, { useEffect, useRef, useState } from "react";
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

interface Star {
  x: number;
  y: number;
  vy: number;
  tw: number;
  phase: number;
  c: string;
}

function AsciiUniverse({ enabled = true }: { enabled?: boolean }) {
  const prefersReduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const gridRef = useRef<{ rows: number; cols: number; cellX: number; cellY: number; fontSize: number }>({ rows: 0, cols: 0, cellX: 10, cellY: 18, fontSize: 12 });
  const starsRef = useRef<Star[]>([]);
  const lastRef = useRef<number>(0);

  const setup = () => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";

    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = Math.max(11, Math.min(16, Math.floor(Math.min(w, h) / 48)));
    const cellX = fontSize * 0.62; 
    const cellY = fontSize * 1.6;
    const cols = Math.ceil(w / cellX);
    const rows = Math.ceil(h / cellY);
    gridRef.current = { rows, cols, cellX, cellY, fontSize };

    const count = Math.floor(cols * rows * 0.03);
    const chars = [".", "·", "*", "+"];
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * cols,
      y: Math.random() * rows,
      vy: 0.06 + Math.random() * 0.12,
      tw: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      c: chars[(Math.random() * chars.length) | 0],
    }));
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  useEffect(() => {
    if (!enabled || prefersReduced) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const tick = (t: number) => {
      const { rows, cellX, cellY, fontSize } = gridRef.current;
      const stars = starsRef.current;
      const dt = Math.min(64, t - (lastRef.current || t));
      lastRef.current = t;

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#0a0a0a";

      for (const s of stars) {
        // advance
        s.y += s.vy * (dt / 16);
        if (s.y >= rows) s.y -= rows;

        // twinkle alpha (subtle)
        const tw = 0.08 + 0.18 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tw + s.phase));
        ctx.globalAlpha = tw;

        const x = Math.floor(s.x) * cellX;
        const y = Math.floor(s.y) * cellY;
        ctx.fillText(s.c, x, y);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, prefersReduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.3) 78%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.3) 78%, transparent 100%)",
      } as React.CSSProperties}
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
      className="underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
    >
      {children}
    </a>
  );
}

export default function PersonalSite() {
  const [starsOn, setStarsOn] = useState<boolean>(true);

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
    <div className="relative min-h-screen bg-stone-50 text-stone-900 antialiased selection:bg-stone-900 selection:text-stone-50">
      {starsOn && <AsciiUniverse enabled={starsOn} />}

      {/* Soft vignette */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(16,16,16,0.06),transparent_60%)]" />

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
                <span className="absolute left-0 top-3 text-stone-400 group-hover:text-stone-700 transition">•</span>
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section className="mt-12" {...fadeIn}>
          <p>
            If you want to talk, just say hi on {" "}
            <Link href="https://www.linkedin.com/in/adrianlorenzomelian/">LinkedIn</Link> {" · "}
            <Link href="https://twitter.com/xAdrianLorenzo">Twitter</Link>.
          </p>
        </motion.section>

      </main>
    </div>
  );
}
