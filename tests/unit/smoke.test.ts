import { CONFIG } from "@app/config";
import { qualityTier } from "@canvas/quality";
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("config exposes the project codename", () => {
    expect(CONFIG.codename).toBe("event-horizon");
  });

  it("a quality tier is selectable", () => {
    const tier = qualityTier("high");
    expect(tier.name).toBe("high");
    expect(tier.lensingSamples).toBeGreaterThan(0);
  });
});
