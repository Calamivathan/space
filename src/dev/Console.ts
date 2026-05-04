import type { Loop } from "@canvas/core/Loop";
import type { Stage } from "@canvas/core/Stage";
import { type QualityTierName, qualityTier } from "@canvas/quality";
import { Pane } from "tweakpane";

export interface DevConsoleOptions {
  stage: Stage;
  loop: Loop;
}

const VISIBLE_KEY = "eh.devconsole.visible";

/**
 * Tweakpane-backed dev console, toggled by the `~` key.
 * Mounted only when `import.meta.env.DEV`. T2+ will register
 * frame-time, GPU info, and a tier-override here.
 */
export function mountDevConsole({ stage, loop }: DevConsoleOptions): () => void {
  const host = document.createElement("div");
  host.className = "dev-console";
  document.body.appendChild(host);

  const pane = new Pane({ container: host, title: "Dev Console (~)" });

  const fps = { value: 0, frameMs: 0 };
  pane.addBinding(fps, "value", {
    readonly: true,
    label: "fps",
    format: (v: number) => v.toFixed(0),
  });
  pane.addBinding(fps, "frameMs", {
    readonly: true,
    label: "frame ms",
    format: (v: number) => v.toFixed(2),
  });

  const tier = { name: stage.tier.name as QualityTierName };
  pane
    .addBinding(tier, "name", {
      label: "quality",
      options: {
        ultra: "ultra",
        high: "high",
        medium: "medium",
        low: "low",
        "cinematic-mobile": "cinematic-mobile",
      },
    })
    .on("change", (e: { value: QualityTierName }) => {
      stage.setTier(qualityTier(e.value));
    });

  const time = { sim: 0, real: 0 };
  pane.addBinding(time, "sim", {
    readonly: true,
    label: "simTime (s)",
    format: (v: number) => v.toFixed(2),
  });
  pane.addBinding(time, "real", {
    readonly: true,
    label: "realTime (s)",
    format: (v: number) => v.toFixed(2),
  });

  let frames = 0;
  let lastSecond = performance.now();
  let lastFrame = performance.now();

  const sample = () => {
    const now = performance.now();
    const dt = now - lastFrame;
    lastFrame = now;
    fps.frameMs = dt;
    frames++;
    if (now - lastSecond >= 1000) {
      fps.value = frames * (1000 / (now - lastSecond));
      frames = 0;
      lastSecond = now;
    }
    time.sim = loop.clock.simTime;
    time.real = loop.clock.realTime;
    pane.refresh();
    sampleId = requestAnimationFrame(sample);
  };
  let sampleId = requestAnimationFrame(sample);

  // Persist visibility across reloads so devs aren't surprised.
  const setVisible = (v: boolean) => {
    host.style.display = v ? "block" : "none";
    try {
      localStorage.setItem(VISIBLE_KEY, v ? "1" : "0");
    } catch {
      /* storage may be unavailable in some contexts */
    }
  };
  let visible = false;
  try {
    visible = localStorage.getItem(VISIBLE_KEY) === "1";
  } catch {
    /* ignore */
  }
  setVisible(visible);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "`" || e.key === "~") {
      visible = !visible;
      setVisible(visible);
      e.preventDefault();
    }
  };
  window.addEventListener("keydown", onKey);

  return () => {
    window.removeEventListener("keydown", onKey);
    cancelAnimationFrame(sampleId);
    pane.dispose();
    host.remove();
  };
}
