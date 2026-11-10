/**
 * Perceptual controls for the landing page. Values are intentionally not raw
 * shader or transform values: the derived values below protect readability.
 */
const tuning = {
  fisheyePinch: 0.29,
  scrollElasticity: 0.39,
  parallaxDepth: 0.27,
  uiAudioVolume: 0.15,
} as const;

export const landingMotion = {
  tuning,
  lenis: {
    duration: 0.92 + tuning.scrollElasticity * 0.45,
    lerp: 0.11 - tuning.scrollElasticity * 0.05,
  },
  velocity: { damping: 0.065 + tuning.scrollElasticity * 0.065, max: 1.25 },
  magnetic: { distance: 92, strength: 0.16 },
  parallax: { maxTilt: 1.2 + tuning.parallaxDepth * 4 },
} as const;
