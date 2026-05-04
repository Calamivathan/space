/**
 * Quality tiers per README §7.4. T2 will replace the hand-picked tier with
 * the result of a GPU benchmark; T1 ships only the registry + selector.
 */

export type QualityTierName = "ultra" | "high" | "medium" | "low" | "cinematic-mobile";

export interface QualityTier {
  readonly name: QualityTierName;
  readonly resolutionScale: number;
  readonly lensingSamples: number;
  readonly diskSamples: number;
  readonly bloomPasses: number;
  readonly particles: number;
}

export const QUALITY_TIERS: Readonly<Record<QualityTierName, QualityTier>> = Object.freeze({
  ultra: {
    name: "ultra",
    resolutionScale: 1.0,
    lensingSamples: 256,
    diskSamples: 128,
    bloomPasses: 6,
    particles: 50_000,
  },
  high: {
    name: "high",
    resolutionScale: 1.0,
    lensingSamples: 128,
    diskSamples: 64,
    bloomPasses: 4,
    particles: 25_000,
  },
  medium: {
    name: "medium",
    resolutionScale: 0.85,
    lensingSamples: 64,
    diskSamples: 32,
    bloomPasses: 3,
    particles: 10_000,
  },
  low: {
    name: "low",
    resolutionScale: 0.7,
    lensingSamples: 32,
    diskSamples: 16,
    bloomPasses: 2,
    particles: 3_000,
  },
  "cinematic-mobile": {
    name: "cinematic-mobile",
    resolutionScale: 0.6,
    lensingSamples: 24,
    diskSamples: 12,
    bloomPasses: 2,
    particles: 1_000,
  },
});

export function qualityTier(name: QualityTierName): QualityTier {
  return QUALITY_TIERS[name];
}
