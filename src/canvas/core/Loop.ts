import { Clock } from "./Clock";
import type { Stage } from "./Stage";

type AfterFirstFrame = () => void;

/**
 * Loop — the project's only `requestAnimationFrame` driver.
 *
 * Per README §7.2 the loop runs three pipelines:
 *   - render tick  (vsync, this file)
 *   - physics tick (fixed 120 Hz, T2)
 *   - UI tick      (throttled, T8)
 *
 * T1 ships only the render tick + a fixed-step accumulator skeleton
 * so later tasks can plug into a stable contract.
 */
export class Loop {
  readonly clock = new Clock();
  readonly stage: Stage;

  private running = false;
  private rafId: number | null = null;
  private firstFrameFired = false;
  private firstFrameCb: AfterFirstFrame | null = null;

  /** Fixed physics step (seconds). Decoupled from the render tick. */
  static readonly PHYSICS_STEP = 1 / 120;
  /** Hard cap on physics steps per frame to avoid spiral-of-death. */
  static readonly MAX_STEPS = 8;
  private accumulator = 0;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.rafId = requestAnimationFrame((t) => this.frame(t));
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** Subscribe to a one-shot callback fired right after the first render. */
  onAfterFirstFrame(cb: AfterFirstFrame): void {
    if (this.firstFrameFired) cb();
    else this.firstFrameCb = cb;
  }

  /** Visible for testing. Drives one render frame. */
  step(now: number): void {
    const dt = this.clock.tick(now);

    // Fixed-step physics accumulator. T1 has no physics yet — kept as
    // a working contract for T2 to attach scenarios/integrators.
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= Loop.PHYSICS_STEP && steps < Loop.MAX_STEPS) {
      this.accumulator -= Loop.PHYSICS_STEP;
      steps++;
    }
    if (steps >= Loop.MAX_STEPS) this.accumulator = 0;

    this.stage.update(dt);
    this.stage.render();

    if (!this.firstFrameFired) {
      this.firstFrameFired = true;
      this.firstFrameCb?.();
      this.firstFrameCb = null;
    }
  }

  private frame(now: number): void {
    if (!this.running) return;
    this.step(now);
    this.rafId = requestAnimationFrame((t) => this.frame(t));
  }
}
