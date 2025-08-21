import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SOLAR_SYSTEM_CONFIG, COLORS, ANIMATION_CONFIG } from "../constants/animation";
import type { 
  Planet, 
  Star, 
  SolarSystemCenter 
} from "../utils/solarSystem";
import { 
  calculateSunRadius,
  createPlanets,
  createStars,
  createOrbitPaths,
  createSunGradient
} from "../utils/solarSystem";

interface SolarSystemBackgroundProps {
  enabled?: boolean;
}

export function SolarSystemBackground({ enabled = true }: SolarSystemBackgroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const appliedDevicePixelRatioRef = useRef<number>(1);
  const sunGradientRef = useRef<CanvasGradient | null>(null);
  const orbitPathsRef = useRef<Path2D[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const starsRef = useRef<Star[]>([]);
  const centerRef = useRef<SolarSystemCenter>({ x: 0, y: 0, sunRadius: 60 });

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

    const sunRadius = calculateSunRadius(viewportWidth, viewportHeight);
    const centerX = viewportWidth * 0.5;
    const centerY = viewportHeight * 0.5;
    centerRef.current = { x: centerX, y: centerY, sunRadius };

    planetsRef.current = createPlanets(sunRadius);
    starsRef.current = createStars(viewportWidth, viewportHeight);
    orbitPathsRef.current = createOrbitPaths(planetsRef.current, centerX, centerY);
    sunGradientRef.current = createSunGradient(context, centerX, centerY, sunRadius);
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

  const renderSun = (context: CanvasRenderingContext2D) => {
    const { x: centerX, y: centerY, sunRadius } = centerRef.current;
    context.globalAlpha = 1;
    context.fillStyle = sunGradientRef.current!;
    context.beginPath();
    context.arc(centerX, centerY, sunRadius * SOLAR_SYSTEM_CONFIG.sunGlowMultiplier, 0, Math.PI * 2);
    context.fill();
  };

  const renderOrbits = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = COLORS.orbitStroke;
    for (const orbitPath of orbitPathsRef.current) {
      context.stroke(orbitPath);
    }
  };

  const renderPlanets = (context: CanvasRenderingContext2D, deltaTime: number) => {
    const { x: centerX, y: centerY } = centerRef.current;
    context.fillStyle = COLORS.planetFill;
    
    for (const planet of planetsRef.current) {
      planet.phase += planet.angularSpeed * (deltaTime / 1000);
      const planetX = centerX + Math.cos(planet.phase) * planet.semiMajorAxis;
      const planetY = centerY + Math.sin(planet.phase) * planet.semiMinorAxis;
      
      context.globalAlpha = Math.max(SOLAR_SYSTEM_CONFIG.planetMinAlpha, planet.opacity);
      context.beginPath();
      context.arc(planetX, planetY, planet.radius, 0, Math.PI * 2);
      context.fill();
    }
  };

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
    renderSun(context);
    renderOrbits(context);
    renderPlanets(context, deltaTime);

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
