import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SOLAR_SYSTEM_CONFIG, COLORS, ANIMATION_CONFIG } from "../constants/animation";
import type { Star } from "../utils/solarSystem";
import { createStars } from "../utils/solarSystem";

interface SolarSystemBackgroundProps {
  enabled?: boolean;
}

export function SolarSystemBackground({ enabled = true }: SolarSystemBackgroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const appliedDevicePixelRatioRef = useRef<number>(1);
  // Removed sun/planet/orbit state, only stars now
  const starsRef = useRef<Star[]>([]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const devicePixelRatio = Math.min(
      SOLAR_SYSTEM_CONFIG.maxDevicePixelRatio,
      window.devicePixelRatio || 1
    );
    appliedDevicePixelRatioRef.current = devicePixelRatio;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    canvas.width = Math.floor(viewportWidth * devicePixelRatio);
    canvas.height = Math.floor(viewportHeight * devicePixelRatio);
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  starsRef.current = createStars(viewportWidth, viewportHeight);
  };

  const renderStars = (context: CanvasRenderingContext2D, currentTime: number, deltaTime: number, viewportWidth: number) => {
    for (const star of starsRef.current) {
      star.x += SOLAR_SYSTEM_CONFIG.starDriftSpeed * (deltaTime / SOLAR_SYSTEM_CONFIG.starFrameNormalizer);
      if (star.x > viewportWidth) star.x -= viewportWidth;

      const twinklePhase = currentTime * SOLAR_SYSTEM_CONFIG.starTwinkleTimeScale * star.twinkleRate + star.phase;
      const opacity = SOLAR_SYSTEM_CONFIG.starBaseAlpha + 
        SOLAR_SYSTEM_CONFIG.starTwinkleAlpha * (0.5 + 0.5 * Math.sin(twinklePhase));
      
      context.globalAlpha = opacity;
      context.fillStyle = COLORS.starFill;
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }
  };

  // Sun / orbits / planets removed

  const animate = (currentTime: number) => {
    const deltaTime = Math.min(ANIMATION_CONFIG.maxFrameDelta, currentTime - (lastFrameTimeRef.current || currentTime));
    lastFrameTimeRef.current = currentTime;

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
  const devicePixelRatio = appliedDevicePixelRatioRef.current;
  const viewportWidth = canvas.width / devicePixelRatio;
  const viewportHeight = canvas.height / devicePixelRatio;

    context.clearRect(0, 0, viewportWidth, viewportHeight);

    renderStars(context, currentTime, deltaTime, viewportWidth);
  // Only stars

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    window.addEventListener("orientationchange", setupCanvas);
    return () => {
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("orientationchange", setupCanvas);
    };
  }, []);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [enabled, prefersReducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
