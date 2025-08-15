export const ANIMATION_CONFIG = {
  fadeInDuration: 0.45,
  fadeInEasing: "easeOut" as const,
  flickerInterval: 0.15,
  maxFrameDelta: 64,
} as const;

export const VIEWPORT_FONT_CONFIG = {
  viewportHeightRatio: 0.024,
  viewportWidthRatio: 0.014,
  minimumFontSize: 14,
  maximumFontSize: 28,
} as const;

export const SOLAR_SYSTEM_CONFIG = {
  maxDevicePixelRatio: 2,
  sunRadiusMin: 40,
  sunRadiusMax: 90,
  sunRadiusViewportRatio: 0.08,
  sunGlowMultiplier: 1.4,
  orbitCount: 5,
  orbitBaseMultiplier: 1.7,
  orbitSpacing: 0.9,
  planetBaseRadius: 1.8,
  planetRadiusIncrement: 0.8,
  planetBaseSpeed: 0.10,
  planetBaseAlpha: 0.5,
  planetAlphaDecrement: 0.08,
  planetMinAlpha: 0.25,
  ellipseEccentricity: 0.8,
  starDensity: 0.00012,
  starLargeProbability: 0.2,
  starLargeSize: 1.4,
  starSmallSize: 1.0,
  starTwinkleMin: 0.6,
  starTwinkleRange: 0.7,
  starDriftSpeed: 0.005,
  starFrameNormalizer: 16,
  starTwinkleTimeScale: 0.001,
  starBaseAlpha: 0.15,
  starTwinkleAlpha: 0.25,
} as const;

export const COLORS = {
  sunGradientInner: "rgba(255, 210, 140, 0.32)",
  sunGradientOuter: "rgba(255, 210, 140, 0.00)",
  orbitStroke: "rgba(255,255,255,0.10)",
  planetFill: "#e5e5e5",
  starFill: "#fff",
} as const;
