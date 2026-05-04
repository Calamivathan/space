import { mountDevConsole } from "@/dev/Console";
import { Loop } from "@canvas/core/Loop";
import { Stage } from "@canvas/core/Stage";
import { type QualityTierName, qualityTier } from "@canvas/quality";
import { CONFIG } from "./config";

export interface BootOptions {
  canvas: HTMLCanvasElement;
  bootEl: HTMLElement;
  tier?: QualityTierName;
}

export interface BootResult {
  stage: Stage;
  loop: Loop;
  dispose: () => void;
}

/**
 * Wires the canvas, the render loop, and the dev console.
 * Returns handles so tests / HMR can tear it down cleanly.
 */
export function boot(opts: BootOptions): BootResult {
  const tier = qualityTier(opts.tier ?? autoTier());
  const stage = new Stage(opts.canvas, tier);
  const loop = new Loop(stage);

  loop.start();

  // Mark the boot overlay as ready as soon as the first render completes.
  loop.onAfterFirstFrame(() => {
    opts.bootEl.dataset.boot = "ready";
    opts.bootEl.textContent = "";
  });

  const disposeConsole = import.meta.env.DEV ? mountDevConsole({ stage, loop }) : () => {};

  const dispose = () => {
    disposeConsole();
    loop.stop();
    stage.dispose();
  };

  document.title = CONFIG.title;
  return { stage, loop, dispose };
}

/**
 * Pre-§T2 placeholder for the GPU benchmark. Picks a sensible default
 * from heuristic device hints; the real auto-tuner ships with T2.
 */
function autoTier(): QualityTierName {
  const dpr = typeof globalThis.devicePixelRatio === "number" ? globalThis.devicePixelRatio : 1;
  const cores = (globalThis.navigator?.hardwareConcurrency ?? 4) as number;
  const mem = (globalThis.navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (cores >= 8 && mem >= 8 && dpr <= 2) return "high";
  if (cores >= 4 && mem >= 4) return "medium";
  return "low";
}
