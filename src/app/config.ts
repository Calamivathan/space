/**
 * Project-wide constants. Single source of truth for the boot screen,
 * meta tags, capture watermark, etc. Not user-tweakable.
 */
export const CONFIG = {
  codename: "event-horizon",
  title: "Event Horizon — Interactive Black Hole Observatory",
  tagline: "Bend light. Bend time. Bend your understanding.",
  version: "0.1.0",
} as const;

export type AppConfig = typeof CONFIG;
