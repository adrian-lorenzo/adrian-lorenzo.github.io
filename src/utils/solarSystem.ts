import { SOLAR_SYSTEM_CONFIG, COLORS } from "../constants/animation";

export interface Planet {
  semiMajorAxis: number;
  semiMinorAxis: number;
  radius: number;
  angularSpeed: number;
  phase: number;
  opacity: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  twinkleRate: number;
  phase: number;
}

export interface SolarSystemCenter {
  x: number;
  y: number;
  sunRadius: number;
}

export function calculateSunRadius(viewportWidth: number, viewportHeight: number): number {
  const viewportSize = Math.min(viewportWidth, viewportHeight);
  const calculatedRadius = viewportSize * SOLAR_SYSTEM_CONFIG.sunRadiusViewportRatio;
  return Math.max(
    SOLAR_SYSTEM_CONFIG.sunRadiusMin,
    Math.min(SOLAR_SYSTEM_CONFIG.sunRadiusMax, calculatedRadius)
  );
}

export function createPlanets(sunRadius: number): Planet[] {
  const baseOrbitRadius = sunRadius * SOLAR_SYSTEM_CONFIG.orbitBaseMultiplier;
  
  return Array.from({ length: SOLAR_SYSTEM_CONFIG.orbitCount }, (_, index) => {
    const orbitRadius = baseOrbitRadius + index * sunRadius * SOLAR_SYSTEM_CONFIG.orbitSpacing;
    const semiMajorAxis = orbitRadius;
    const semiMinorAxis = orbitRadius * SOLAR_SYSTEM_CONFIG.ellipseEccentricity;
    const radius = SOLAR_SYSTEM_CONFIG.planetBaseRadius + index * SOLAR_SYSTEM_CONFIG.planetRadiusIncrement;
    const angularSpeed = SOLAR_SYSTEM_CONFIG.planetBaseSpeed / (index + 1);
    const phase = Math.random() * Math.PI * 2;
    const opacity = SOLAR_SYSTEM_CONFIG.planetBaseAlpha - index * SOLAR_SYSTEM_CONFIG.planetAlphaDecrement;
    
    return {
      semiMajorAxis,
      semiMinorAxis,
      radius,
      angularSpeed,
      phase,
      opacity,
    };
  });
}

export function createStars(viewportWidth: number, viewportHeight: number): Star[] {
  const starCount = Math.floor(viewportWidth * viewportHeight * SOLAR_SYSTEM_CONFIG.starDensity);
  
  return Array.from({ length: starCount }, () => ({
    x: Math.random() * viewportWidth,
    y: Math.random() * viewportHeight,
    size: Math.random() < SOLAR_SYSTEM_CONFIG.starLargeProbability 
      ? SOLAR_SYSTEM_CONFIG.starLargeSize 
      : SOLAR_SYSTEM_CONFIG.starSmallSize,
    twinkleRate: SOLAR_SYSTEM_CONFIG.starTwinkleMin + Math.random() * SOLAR_SYSTEM_CONFIG.starTwinkleRange,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function createOrbitPaths(planets: Planet[], centerX: number, centerY: number): Path2D[] {
  return planets.map(planet => {
    const path = new Path2D();
    if ((path as any).ellipse) {
      (path as any).ellipse(centerX, centerY, planet.semiMajorAxis, planet.semiMinorAxis, 0, 0, Math.PI * 2);
    } else {
      const averageRadius = (planet.semiMajorAxis + planet.semiMinorAxis) / 2;
      path.arc(centerX, centerY, averageRadius, 0, Math.PI * 2);
    }
    return path;
  });
}

export function createSunGradient(
  context: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  sunRadius: number
): CanvasGradient {
  const gradient = context.createRadialGradient(
    centerX, centerY, 0, 
    centerX, centerY, sunRadius * SOLAR_SYSTEM_CONFIG.sunGlowMultiplier
  );
  gradient.addColorStop(0, COLORS.sunGradientInner);
  gradient.addColorStop(1, COLORS.sunGradientOuter);
  return gradient;
}
