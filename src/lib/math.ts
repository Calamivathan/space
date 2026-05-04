/** Clamp `n` into `[lo, hi]`. */
export const clamp = (n: number, lo: number, hi: number): number => (n < lo ? lo : n > hi ? hi : n);

/** Linear interpolate. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Frame-rate-independent damping toward `b` with halflife `h` seconds. */
export const damp = (a: number, b: number, h: number, dt: number): number =>
  lerp(a, b, 1 - 2 ** (-dt / Math.max(h, 1e-6)));
