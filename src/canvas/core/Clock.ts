/**
 * Clock — the project's only authority on time.
 *
 * `realTime` is wall-clock seconds since the loop started.
 * `simTime`  is integrated through `timeScale`, so scrubbing/scenarios
 * can warp it without touching real-time-bound systems (audio, UI).
 */
export class Clock {
  private last = 0;
  private started = false;

  realTime = 0;
  simTime = 0;
  dt = 0;
  timeScale = 1;

  /** Marks the clock running; the next `tick()` will report dt = 0. */
  start(now: number): void {
    this.last = now;
    this.started = true;
  }

  /** Updates `dt`, `realTime`, and `simTime`. Returns `dt` in seconds. */
  tick(now: number): number {
    if (!this.started) {
      this.start(now);
      return 0;
    }
    const dt = (now - this.last) / 1000;
    this.last = now;
    // Clamp to avoid catastrophic jumps after a tab returns from background.
    this.dt = Math.min(dt, 0.1);
    this.realTime += this.dt;
    this.simTime += this.dt * this.timeScale;
    return this.dt;
  }

  reset(): void {
    this.last = 0;
    this.started = false;
    this.realTime = 0;
    this.simTime = 0;
    this.dt = 0;
  }
}
