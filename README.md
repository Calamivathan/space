# EVENT HORIZON
## An Interactive 3D Black Hole Observatory & Simulator

> A real-time, scientifically-grounded, artistically-uncompromising browser experience that lets a visitor inhabit, manipulate, and study a black hole.

This document is the **single source of truth** for the project. It contains the Product Requirements Document (PRD), the design specification, the asset manifest, the engineering architecture, the full UI inventory, and the **12-task execution plan** with embedded review and git-backup discipline. Everything below is to be treated as binding spec unless explicitly amended in a follow-up commit to this file.

---

## TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [Team & Role Personas](#2-team--role-personas)
3. [Vision Statement](#3-vision-statement)
4. [Goals, Non-Goals & Success Metrics](#4-goals-non-goals--success-metrics)
5. [Target Audience](#5-target-audience)
6. [Tech Stack & Rationale](#6-tech-stack--rationale)
7. [System Architecture](#7-system-architecture)
8. [Scientific Foundation](#8-scientific-foundation)
9. [Visual & Art Direction](#9-visual--art-direction)
10. [Full UI Specification](#10-full-ui-specification)
11. [Feature Catalog](#11-feature-catalog)
12. [Asset Manifest (Self-Authored)](#12-asset-manifest-self-authored)
13. [Performance Budget](#13-performance-budget)
14. [Accessibility & Internationalization](#14-accessibility--internationalization)
15. [Git Workflow, Backup & Review Discipline](#15-git-workflow-backup--review-discipline)
16. [THE 12 TASKS](#16-the-12-tasks)
17. [Definition of Done](#17-definition-of-done)
18. [Risk Register](#18-risk-register)
19. [Glossary](#19-glossary)

---

## 1. PROJECT IDENTITY

| Field | Value |
| --- | --- |
| **Codename** | Event Horizon |
| **Working Title** | Event Horizon — Interactive Black Hole Observatory |
| **Tagline** | *"Bend light. Bend time. Bend your understanding."* |
| **Domain (proposed)** | eventhorizon.observatory / eh.science |
| **Format** | Single-page, GPU-accelerated WebGL2 / WebGPU experience |
| **Primary Surface** | Desktop browser, 1080p baseline, 4K ready |
| **Secondary Surface** | Tablet (reduced fidelity), Mobile (cinematic mode only) |
| **Repository Layout** | Monorepo, `pnpm` workspaces |
| **License** | MIT for code, CC-BY-SA 4.0 for assets |

---

## 2. TEAM & ROLE PERSONAS

This project is being executed by a four-hat team operating from a single brain. Each hat owns specific decisions and signs off on different deliverables.

### 2.1 The Web Designer ("Aria")
Owns the user-facing experience: layout, typography, motion, micro-interactions, responsiveness. Ships the styleguide. Has veto over anything that hurts perceived performance.

### 2.2 The System Designer ("Kael")
Owns architecture: build pipeline, render loop, state management, module boundaries, performance budgets. Has veto over anything that costs more than 16ms/frame at the target quality tier.

### 2.3 The Artist ("Nova")
Owns the look. Hand-authors textures, shaders, color palettes, particle FX, models. Owns the `assets/` directory. Has veto over anything that looks "stock".

### 2.4 The Scientist ("Dr. Vex")
Owns physical fidelity. Validates that the simulation is at minimum *qualitatively correct* and at best *quantitatively defensible* against published GR results. Writes the equations panel. Has veto over anything labeled "scientific" that isn't.

> **Working agreement:** Every task in Section 16 lists which hats must sign off before the commit is tagged complete.

---

## 3. VISION STATEMENT

We are building the website that, when a curious 14-year-old or a tenured astrophysicist lands on it, makes them lose track of time. It must feel less like a "demo" and more like a **machine** — an instrument they are operating. Every slider has weight. Every parameter visibly bends spacetime. Every frame is rendered as if it were the cover of a research journal.

Three pillars, in priority order when they conflict:

1. **Awe** — the first 5 seconds must produce involuntary curiosity.
2. **Truth** — nothing displayed as physics is a lie. Stylization is allowed; falsehood is not.
3. **Agency** — the user is not watching a video. They are running a lab.

---

## 4. GOALS, NON-GOALS & SUCCESS METRICS

### 4.1 Goals
- Render a Kerr-Newman black hole with relativistic gravitational lensing in real time.
- Expose 40+ parameters that meaningfully change the simulation, all live-tweakable.
- Provide cinematic, free-orbit, tethered-probe, and in-fall observer modes.
- Ship 6+ scripted scenarios (probe drop, spaghettification, binary merger, jet flare, photon-sphere echo, Hawking-evaporation timelapse).
- Achieve 60fps at 1080p on an RTX 3060 / M2; 30fps on integrated graphics with quality fallback.
- Be educationally rigorous: every visible quantity has a citation in the equations panel.

### 4.2 Non-Goals
- Multiplayer / collaborative editing.
- Account system, login, persistence to a server.
- Mobile-first design (mobile is supported, not optimized for).
- Full GR ray-tracing of arbitrary geodesics (we approximate; we are honest about it).
- VR/AR (post-v1 candidate).

### 4.3 Success Metrics
| Metric | Target |
| --- | --- |
| Lighthouse performance (cold load) | ≥ 85 desktop |
| Time to first interactive frame | ≤ 4s on 50Mbps |
| Sustained FPS at "High" quality, 1080p | ≥ 60 |
| Median session length | ≥ 4 minutes |
| Parameter interactions per session (median) | ≥ 12 |
| Total bundle (compressed, initial) | ≤ 2.5 MB |
| Total assets (deferred) | ≤ 35 MB |

---

## 5. TARGET AUDIENCE

| Segment | What they want |
| --- | --- |
| Curious adult / hobbyist | Awe, intuitive controls, "show me the cool one" presets |
| High-school / undergrad student | Equations, scales, comparisons, exportable screenshots |
| Educator | Lecture mode, frame-step, annotation overlays, embeddable scenarios |
| Researcher / professional | Quantitative readouts, parameter export, reproducible seeds |
| Designer / dev visiting for the craft | Buttery 60fps, beautiful idle state, copyable shader source |

---

## 6. TECH STACK & RATIONALE

### 6.1 Core
- **TypeScript 5.x** — strict mode, branded types for physical units (Mass, Spin, Length).
- **Three.js (latest LTS)** — chosen over raw WebGPU for ecosystem breadth and post-processing.
- **WebGL2** as baseline; **WebGPU** progressive enhancement behind a feature flag.
- **Vite** — fast HMR, tree-shaken production builds, native ESM.
- **GLSL** — hand-written shaders for the lensing pass, accretion disk, and bloom chain.

### 6.2 State & UI
- **Zustand** — atomic stores for simulation state, render state, UI state. Selectors prevent re-render storms.
- **React 19** for the *control panel only*. The 3D canvas is imperative, not React. We never reconcile the GPU through React.
- **Tweakpane** for the dev/debug panel; production UI is custom.
- **Radix UI primitives** for accessible dialogs, tooltips, sliders.

### 6.3 Motion & Audio
- **GSAP** for cinematic camera choreography and HUD transitions.
- **Tone.js** for procedural audio (gravitational-wave chirp synthesis, doppler).

### 6.4 Build & Quality
- **pnpm** workspaces, **Biome** for lint+format, **Vitest** for unit, **Playwright** for E2E.
- **Husky + lint-staged** pre-commit; commits without passing checks are refused.
- **GitHub Actions** CI: lint, typecheck, test, build size budget gate.

### 6.5 Hosting
- **Cloudflare Pages** primary, **Vercel** mirror. Static; no server runtime required.

### 6.6 Why not pure WebGPU?
Browser support is uneven on Safari/Firefox at v1 ship date. WebGPU is gated behind `?gpu=webgpu` and unlocks compute-shader path-traced lensing as a stretch. The default path is WebGL2 to maximize reach.

---

## 7. SYSTEM ARCHITECTURE

### 7.1 Module Map
```
src/
├── app/                      # bootstrap, root component, routing
├── canvas/                   # Three.js scene, render loop, camera rigs
│   ├── core/                 # Renderer, Scene, Loop, Clock
│   ├── objects/              # BlackHole, AccretionDisk, Jet, Skybox, Probe, ParticleSystem
│   ├── shaders/              # .glsl files + loader
│   │   ├── lensing.frag
│   │   ├── disk.frag
│   │   ├── horizon.frag
│   │   ├── bloom.frag
│   │   └── tonemap.frag
│   ├── postprocessing/       # EffectComposer chain
│   └── cameras/              # Cinematic, Orbit, FreeFly, Probe, Infall
├── physics/                  # Pure functions, no Three.js imports
│   ├── metrics/              # Schwarzschild, Kerr, Reissner-Nordström, Kerr-Newman
│   ├── integrators/          # RK4 geodesic stepper (CPU verification path)
│   ├── derived/              # Schwarzschild radius, ISCO, photon sphere, ergosphere
│   ├── thermo/               # Hawking temperature, lifetime, luminosity
│   └── units.ts              # Branded unit types + conversions
├── sim/                      # Time evolution, scenario state machines
├── state/                    # Zustand stores
├── ui/                       # React UI: panels, sliders, modals, HUD
│   ├── panels/
│   ├── primitives/
│   ├── hud/
│   ├── tour/
│   └── styles/
├── audio/                    # Tone.js graph, sample loaders
├── assets/                   # Self-authored textures, models, HDRIs (build-pipeline input)
├── content/                  # Equations, citations, scenario scripts (MDX)
└── lib/                      # Shared utilities, math
```

### 7.2 Render Loop Contract
- Single `requestAnimationFrame` driver in `canvas/core/Loop.ts`.
- Three pipelines: **physics tick** (fixed 120Hz, decoupled), **render tick** (vsync), **UI tick** (React, throttled 30Hz for HUD telemetry).
- Physics never reads from React state directly; it reads from a shared `SimStore` snapshot taken at frame start.
- Every shader uniform that comes from UI flows through a debounced/lerped writer to avoid tearing.

### 7.3 Data Flow
```
UI slider --(action)--> SimStore --(snapshot)--> PhysicsTick --(uniforms)--> RenderTick --> Canvas
                                                       |
                                                       +--> TelemetryStore --(throttled)--> HUD
```

### 7.4 Quality Tiers
| Tier | Resolution scale | Lensing samples | Disk samples | Bloom passes | Particles |
| --- | --- | --- | --- | --- | --- |
| **Ultra** | 1.0× | 256 | 128 | 6 | 50k |
| **High** | 1.0× | 128 | 64 | 4 | 25k |
| **Medium** | 0.85× | 64 | 32 | 3 | 10k |
| **Low** | 0.7× | 32 | 16 | 2 | 3k |
| **Cinematic-Mobile** | 0.6× | 24 | 12 | 2 | 1k |

Quality is auto-selected on first load via a 3-second GPU benchmark, and overridable in Settings.

---

## 8. SCIENTIFIC FOUNDATION

Every "physics" claim in the UI must trace to one of these references, cited inline in the equations panel:

- Misner, Thorne, Wheeler — *Gravitation* (1973)
- Bardeen, Press, Teukolsky (1972) — Kerr geodesics
- Page & Thorne (1974) — accretion disk emission
- Luminet (1979) — visual appearance of a Schwarzschild black hole
- James, von Tunzelmann, Franklin, Thorne (2015) — Gargantua paper from *Interstellar*
- EHT Collaboration (2019, 2022) — M87\* and Sgr A\* results
- Hawking (1975) — particle creation by black holes

### 8.1 Implemented metrics
- **Schwarzschild** (M only) — default, fastest path.
- **Kerr** (M, a) — rotating; enables ergosphere, frame dragging, ISCO shift.
- **Reissner-Nordström** (M, Q) — charged; mostly pedagogical.
- **Kerr-Newman** (M, a, Q) — full superset; behind a "Research" toggle.

### 8.2 Approximations & honesty
- Lensing is rendered via an **analytic deflection texture** baked from numerical geodesic integration, not per-pixel ray-traced GR. The UI labels this as "approximate lensing".
- Accretion disk emission uses a Page-Thorne temperature profile but is rendered via a stylized blackbody LUT. Doppler beaming and gravitational redshift are applied; full radiative transfer is not.
- Hawking radiation is purely visual; the timescale slider is logarithmic and labeled accordingly.

### 8.3 Live-displayed quantities
For any chosen `(M, a, Q)`:
- Schwarzschild radius `r_s = 2GM/c^2` (km)
- Outer/inner horizons (Kerr): `r_± = M ± sqrt(M^2 - a^2 - Q^2)` (geometric units, displayed in km)
- ISCO radius (prograde, retrograde)
- Photon sphere radius
- Ergosphere extent
- Hawking temperature `T_H` (K)
- Evaporation lifetime (years)
- Bekenstein-Hawking entropy (k_B)
- Tidal acceleration at observer (m/s²)
- Time dilation factor at observer
- Gravitational redshift factor at observer
- Eddington luminosity (erg/s)

---

## 9. VISUAL & ART DIRECTION

### 9.1 Mood
*Cold-archival-instrument meets cathedral-light.* Think the bridge of a deep-space probe rendered by Roger Deakins. Restrained UI chrome; explosive central image.

### 9.2 Palette
| Token | Hex | Usage |
| --- | --- | --- |
| `void.0` | `#05060A` | Background |
| `void.1` | `#0B0E16` | Panel base |
| `void.2` | `#141826` | Elevated surface |
| `frost.0` | `#E8ECF5` | Primary text |
| `frost.1` | `#9BA3B7` | Secondary text |
| `signal.cyan` | `#5BE9F5` | Active control, axis |
| `signal.amber` | `#F5B85B` | Warnings, accretion accent |
| `signal.crimson` | `#F25B6E` | Destructive, singularity warnings |
| `relic.gold` | `#F0D58A` | Achievements, presets |

Disk gradient (artist-painted, baked LUT): deep crimson → orange → white-hot → cyan-blue (Doppler-blueshifted side).

### 9.3 Typography
- **Display:** Space Grotesk Variable (700–900 for HUD numerics).
- **Body / UI:** Inter Variable (400–600).
- **Monospace / Telemetry:** JetBrains Mono Variable.
- **Equations:** KaTeX, served locally.

### 9.4 Motion language
- Default ease: `cubic-bezier(0.16, 1, 0.3, 1)` — a long quiet exit.
- Panel openings are 280ms; modal openings are 420ms with a 60ms blur backdrop fade.
- Sliders have a 90ms snap-on-grab indicator; values lerp into the simulation over 240ms.
- The black hole itself never stops rotating; the camera never fully comes to rest at idle (1.5° micro-drift over 18s loop).

### 9.5 Sound design
- Ambient bed: detuned drone, 7-note pelog scale, granular textures.
- Parameter changes: a low *tick* (60Hz) for integers, a sine glide for continuous.
- Photon-sphere event: subharmonic *thud* + reverse cymbal swell.
- Singularity proximity: increasing low-frequency hum, mapped to `1 / (r - r_s)`.
- Mute by default until first user interaction (browser autoplay policy).

---

## 10. FULL UI SPECIFICATION

The UI is intentionally dense. Density is the point — this is an instrument panel, not a landing page. Everything is reachable in ≤2 clicks from idle.

### 10.1 Layout regions
```
+------------------------------------------------------------------+
|  TOP BAR — logo, scenario selector, view mode, share, settings    |
+----------+-------------------------------------------+-----------+
|          |                                           |           |
| LEFT     |                                           |  RIGHT    |
| RAIL     |          3D CANVAS (full viewport)        |  CONTROL  |
| (icons)  |                                           |  PANEL    |
|          |                                           |           |
+----------+-------------------------------------------+-----------+
|  BOTTOM HUD — telemetry strip, timeline, play controls            |
+------------------------------------------------------------------+
```
The right control panel is **collapsible** (320px → 0). The left rail and bottom HUD are always visible at ≥ 80% opacity.

### 10.2 Top Bar
- Logo / home (collapses panels to "cinematic" mode).
- Scenario dropdown (presets, see §10.13).
- View-mode pill: `Cinematic | Orbit | Free-fly | Probe | Infall`.
- Share button (copies a URL with seralized state).
- Capture button (PNG / WebM / MP4 export).
- Settings (gear) — quality, audio, a11y.
- Help (?) — opens the tour.

### 10.3 Left Rail (icon-only, tooltips on hover)
- **Black Hole** — opens BH properties group.
- **Disk** — accretion disk group.
- **Jet** — relativistic jet group.
- **Environment** — sky, nebula, companion star.
- **Camera** — observer config.
- **Visualization** — overlays, post-FX.
- **Audio** — sound design.
- **Education** — annotations, equations, comparisons.
- **Scenarios** — scripted sequences.
- **Performance** — quality, FPS, GPU info.
- **Notebook** — saved presets, parameter history.
- **Console** — dev mode, toggled by `~` key.

Clicking a rail item opens the corresponding accordion in the right panel and scrolls to it.

### 10.4 Right Control Panel — Group A: Black Hole Properties
| Control | Type | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| Type preset | radio | Stellar / Intermediate / Supermassive / Primordial / Custom | Stellar | Sets reasonable M range |
| Mass `M` | log slider | 1 to 10^10 M_☉ | 10 | Live recompute of r_s |
| Spin `a/M` | slider | -0.998 to 0.998 | 0.7 | Negative = retrograde |
| Charge `Q/M` | slider | 0 to 1 | 0 | "Research" mode only |
| Metric | segmented | Schwarzschild / Kerr / RN / Kerr-Newman | Kerr | Auto-locks irrelevant params |
| Inclination | slider | 0 to 90° | 17° | Of disk relative to viewer |

### 10.5 Right Control Panel — Group B: Accretion Disk
| Control | Type | Range | Default |
| --- | --- | --- | --- |
| Enabled | toggle | — | on |
| Inner radius (× ISCO) | slider | 1.0 to 4.0 | 1.0 |
| Outer radius (× r_s) | slider | 5 to 100 | 30 |
| Density | slider | 0 to 1 | 0.6 |
| Temperature peak (K) | slider | 10⁴ to 10⁹ | 10⁷ |
| Color profile | segmented | Blackbody / Stylized / Monochrome | Blackbody |
| Doppler beaming | toggle | — | on |
| Relativistic boost gain | slider | 0 to 2 | 1 |
| Turbulence | slider | 0 to 1 | 0.4 |
| Animation speed | slider | 0 to 4× | 1 |
| Disk thickness (h/r) | slider | 0.01 to 0.3 | 0.05 |

### 10.6 Right Control Panel — Group C: Relativistic Jet
| Control | Type | Range | Default |
| --- | --- | --- | --- |
| Enabled | toggle | — | off |
| Lorentz factor Γ | slider | 1 to 30 | 5 |
| Opening angle | slider | 1° to 30° | 6° |
| Brightness | slider | 0 to 2 | 1 |
| Helical structure | toggle | — | on |
| Magnetic field strength | slider | 0 to 1 | 0.5 |
| Length (× r_s) | slider | 5 to 200 | 60 |

### 10.7 Right Control Panel — Group D: Environment
| Control | Type | Range | Default |
| --- | --- | --- | --- |
| Star field density | slider | 0 to 1 | 0.7 |
| Skybox | dropdown | Deep Field / Galactic Core / Empty / Custom HDRI | Galactic Core |
| Nebula | toggle + tint | — | on / cyan |
| Companion star | toggle + spectral class | O B A F G K M | off |
| Cosmological redshift z | slider | 0 to 10 | 0 |
| Dust scattering | slider | 0 to 1 | 0.2 |

### 10.8 Right Control Panel — Group E: Camera & Observer
| Control | Type | Range | Default |
| --- | --- | --- | --- |
| Mode | segmented | Cinematic / Orbit / Free-fly / Probe / Infall | Cinematic |
| Distance from horizon | log slider | 1.5 r_s to 10⁶ r_s | 30 r_s |
| Azimuth | slider | -180° to 180° | 0° |
| Elevation | slider | -89° to 89° | 12° |
| FoV | slider | 20° to 110° | 50° |
| Roll | slider | -180° to 180° | 0° |
| Focus / DoF | toggle + slider | — | off |
| Exposure | slider | -4 to +4 EV | 0 |
| Motion blur | slider | 0 to 1 | 0.3 |
| Auto-orbit | toggle + speed | — | off / 1× |

### 10.9 Right Control Panel — Group F: Visualization
| Toggle | Default |
| --- | --- |
| Gravitational lensing | on |
| Photon sphere ring | on |
| Ergosphere shading | on (Kerr only) |
| ISCO ring | off |
| Event-horizon membrane | on |
| Geodesic tracer | off |
| Tidal grid overlay | off |
| Hawking glow | off |
| Spacetime grid | off |
| Coordinate axes | off |

| Slider | Range | Default |
| --- | --- | --- |
| Bloom intensity | 0 – 2 | 0.9 |
| Bloom threshold | 0 – 2 | 1.05 |
| Chromatic aberration | 0 – 1 | 0.15 |
| Vignette | 0 – 1 | 0.35 |
| Film grain | 0 – 1 | 0.08 |
| Tonemap | Reinhard / ACES / AGX / Filmic | AGX |

### 10.10 Right Control Panel — Group G: Audio
| Control | Type | Default |
| --- | --- | --- |
| Master | slider | 0.6 |
| Ambient bed | slider | 0.7 |
| Doppler whoosh | slider | 0.5 |
| Singularity hum | slider | 0.4 |
| Parameter ticks | toggle | on |
| Mute | toggle | off |

### 10.11 Right Control Panel — Group H: Education
- **Annotations** — toggle and individually-selectable labels (r_s, ISCO, photon sphere, ergosphere, jet base).
- **Equations panel** — slide-out drawer with KaTeX-rendered formulas, each with a citation.
- **Compare to** — overlay a known object at scale: Earth, Sun, Sgr A\*, M87\*, TON 618.
- **Story mode** — guided 7-chapter tour with synced camera + narration captions.

### 10.12 Right Control Panel — Group I: Performance
- Quality tier selector (Ultra → Cinematic-Mobile).
- Resolution scale (0.5 – 1.0).
- Adaptive LOD toggle.
- FPS / frame-time chart (rolling 120 frames).
- GPU vendor / renderer string (read-only).
- "Why am I capped?" tooltip explaining current bottleneck.

### 10.13 Scenarios (Top-bar dropdown / Left-rail "Scenarios")
1. **Idle Observatory** (default)
2. **Probe Drop** — release a probe; watch it redshift away forever.
3. **Spaghettification** — a star crosses tidal radius.
4. **Binary Merger** — two BHs in-spiral, ringdown audio.
5. **Photon-Sphere Echo** — fire a light pulse, see it loop.
6. **Jet Flare** — accretion rate spike, jet brightens.
7. **Hawking Timelapse** — 10⁶⁷ years in 90 seconds.
8. **Custom Sandbox** — all rails fully unlocked.

### 10.14 Bottom HUD
- Play / Pause / Reverse / Step.
- Time-scale slider (10⁻⁶ to 10⁶ ×, log).
- Simulation clock (formatted).
- Telemetry chips: r_s, T_H, lifetime, time dilation, redshift, tidal accel.
- Timeline scrubber (scenarios only).
- Recording indicator when capturing.

### 10.15 Modals & overlays
- **Settings** (gear) — quality, audio, a11y, language, units (SI / natural / geometric).
- **Share** — generates a stable URL containing base64-encoded state hash.
- **Capture** — PNG (current frame), WebM (1–60s loop), MP4 (1–60s, behind a stretch goal).
- **Tour** — onboarding for first-time visitors; skippable; never shown twice.
- **About / Credits** — list of citations, asset attributions, code license.

### 10.16 Keyboard map
| Key | Action |
| --- | --- |
| `Space` | Pause / play |
| `←` `→` | Step frame back/forward |
| `[` `]` | Slow / speed time |
| `R` | Reset camera |
| `1`–`8` | Switch scenario |
| `H` | Toggle HUD |
| `F` | Fullscreen |
| `C` | Capture frame |
| `~` | Toggle dev console |
| `?` | Open keyboard reference |

### 10.17 Empty / loading / error states
- **Loading**: an animated event-horizon ring, progress percentage, current asset name.
- **WebGL unavailable**: a static hero image (self-painted) with explanatory copy and a link to a YouTube fallback render.
- **GPU starved**: auto-drop to Low tier with a non-modal toast: *"Quality reduced to keep things smooth. Override in Settings."*
- **Browser too old**: minimum-requirements page with no canvas attempted.

---

## 11. FEATURE CATALOG

A flat list, useful for QA. Every item has an owner hat and a target task.

| # | Feature | Owner | Task |
| --- | --- | --- | --- |
| F-01 | WebGL2 renderer with quality tiers | Kael | T2 |
| F-02 | Schwarzschild metric path | Vex | T3 |
| F-03 | Kerr metric path | Vex | T3 |
| F-04 | Kerr-Newman behind research flag | Vex | T7 |
| F-05 | Analytic gravitational lensing shader | Nova+Kael | T3 |
| F-06 | Accretion disk shader (blackbody LUT) | Nova+Vex | T3 |
| F-07 | Doppler beaming + gravitational redshift | Vex | T3 |
| F-08 | Relativistic jet (helical) | Nova+Vex | T7 |
| F-09 | Procedural starfield + nebula | Nova | T4 |
| F-10 | Self-painted skybox HDRIs (3 variants) | Nova | T4 |
| F-11 | Probe 3D model (low-poly, hand-modeled) | Nova | T5 |
| F-12 | Observatory ring station model | Nova | T5 |
| F-13 | Cinematic camera rig with GSAP path | Aria | T6 |
| F-14 | Free-fly camera (FPS-style) | Kael | T6 |
| F-15 | In-fall observer with tidal stretch | Vex+Aria | T6 |
| F-16 | Live-tweakable parameters w/ lerping | Kael | T9 |
| F-17 | Right control panel (all groups) | Aria | T8 |
| F-18 | Left rail navigation | Aria | T8 |
| F-19 | Bottom HUD telemetry | Aria+Vex | T8 |
| F-20 | Scenario engine | Kael | T7 |
| F-21 | 8 scripted scenarios | Vex+Aria | T7 |
| F-22 | Equations panel with citations | Vex | T8 |
| F-23 | Comparative scale overlay | Vex+Aria | T8 |
| F-24 | Audio engine (Tone.js graph) | Aria | T10 |
| F-25 | Procedural gravitational-wave chirp | Vex+Aria | T10 |
| F-26 | URL state share | Kael | T12 |
| F-27 | Frame / clip capture | Kael | T12 |
| F-28 | Adaptive quality auto-tuner | Kael | T11 |
| F-29 | Mobile cinematic fallback | Aria+Kael | T11 |
| F-30 | Onboarding tour | Aria | T12 |
| F-31 | Keyboard shortcut layer | Aria | T8 |
| F-32 | A11y: focus rings, ARIA, reduced-motion | Aria | T11 |
| F-33 | i18n scaffolding (en, es, ja) | Aria | T11 |
| F-34 | Telemetry chip dashboard | Vex | T8 |
| F-35 | Notebook (saved presets) | Aria | T12 |
| F-36 | Dev console (`~` key) | Kael | T1 |
| F-37 | About / credits modal | Aria | T12 |
| F-38 | Error boundaries + crash reporter | Kael | T12 |
| F-39 | Build size budget gate | Kael | T1 |
| F-40 | E2E test suite | Kael | T11 |

---

## 12. ASSET MANIFEST (SELF-AUTHORED)

Every asset below is hand-authored by Nova. No stock packs, no marketplace assets. Procedural where reasonable, painted where not.

### 12.1 Textures (PNG/KTX2, all power-of-two, mipmapped)
- `accretion-blackbody.lut.png` — 1×512 blackbody LUT, 1500K → 30000K.
- `accretion-noise-r.png` — 1024² red-channel turbulence (Worley + curl).
- `accretion-noise-g.png` — 1024² green-channel (offset rotation).
- `disk-density-mask.png` — 512² radial falloff with painted detail.
- `lensing-deflection.exr` — 2048×1024 deflection LUT, baked from RK4 integration.
- `photon-ring-glow.png` — 256×256 radial gradient, premultiplied.
- `event-horizon-membrane.png` — 1024² subtle anisotropic noise.
- `jet-helix.png` — 256×1024 stretched noise + helical bands.
- `tidal-grid.png` — 1024² procedural grid with chromatic seams.
- `vignette.png` — 512² soft black radial.
- `grain.png` — 512² monochrome film grain (animated by frame index).

### 12.2 HDRIs / Skyboxes (cubemap, RGBM-encoded for size)
- `sky-deepfield.hdr` — sparse stars, faint nebulosity, 2k cube faces.
- `sky-galacticcore.hdr` — dense star clouds, dust lanes, warm bias.
- `sky-empty.hdr` — almost-black with a few anchor stars.

### 12.3 Particle sprites
- `particle-spark.png` — 64² white-hot dot with halo.
- `particle-dust.png` — 64² soft brown smudge.
- `particle-debris.png` — 4×4 atlas of jagged silhouettes for spaghettification.

### 12.4 3D Models (glTF 2.0, Draco-compressed)
- `probe.glb` — 1.2k tris, hand-modeled, painted PBR maps.
- `observatory-ring.glb` — 8k tris, modular ring station.
- `companion-star.glb` — sphere proxy + custom emissive shader (no separate model needed).
- `debris-cluster.glb` — 6 unique chunks, instanced.

### 12.5 UI iconography (SVG, hand-drawn)
- 24 line icons for left rail and panel headers (BH, disk, jet, env, camera, viz, audio, edu, scenarios, perf, notebook, console, info, share, capture, settings, play, pause, step, reverse, grid, axes, layers, target).
- 1 logo lockup (animated SVG: a bent ring closing).

### 12.6 Audio (procedural-first; samples fallback)
- Procedural drone via Tone.js (no file).
- `chirp-merger.wav` — synthesized GW150914-style chirp, 4s.
- `thud-photon.wav` — sub-bass impact, 1.2s.
- `tick.wav` — UI tick, 60Hz pulse, 80ms.

### 12.7 Painted hero / fallback images
- `hero-fallback.jpg` — 2560×1440 hand-painted Schwarzschild scene for non-WebGL browsers.
- `og-share.jpg` — 1200×630 social card.
- `favicon.svg` + 16/32/180/512 PNG variants.

### 12.8 Documentation diagrams
- `arch-diagram.svg` — module map.
- `render-pipeline.svg` — frame timeline.
- `physics-stack.svg` — metric → derived quantities.

---

## 13. PERFORMANCE BUDGET

| Resource | Budget | Enforced by |
| --- | --- | --- |
| Initial JS (compressed) | ≤ 220 KB | Vite plugin + CI gate |
| Initial CSS | ≤ 25 KB | CI gate |
| Hero image (fallback) | ≤ 280 KB | build script |
| Total assets at idle | ≤ 8 MB | build script |
| Total assets after lazy-load | ≤ 35 MB | build script |
| GPU memory at Ultra | ≤ 600 MB | runtime probe |
| Frame time (Ultra, 1080p) | ≤ 16.6 ms | runtime guard, auto-downgrade |
| Long task on main thread | ≤ 50 ms | dev assertion |
| Memory leak per minute (idle) | ≤ 1 MB | E2E sentinel |

Auto-downgrade rules:
- 5 consecutive frames over budget → drop one tier.
- 30 consecutive frames under budget × 0.6 → propose upgrade (non-modal toast).

---

## 14. ACCESSIBILITY & INTERNATIONALIZATION

- WCAG 2.2 AA target.
- All controls reachable by keyboard. Focus rings are visible against `void.0`.
- `prefers-reduced-motion`: disables auto-orbit, halves all transitions, removes camera bob.
- `prefers-color-scheme`: dark is canonical; a "high-contrast" variant boosts UI to pure white-on-black.
- Screen-reader: every slider has an aria-label including unit; the canvas itself carries an aria-description summarizing the current scene state.
- Captions for the tour narration.
- Languages at v1: **en** (canonical), **es**, **ja**. All copy in `content/i18n/<lang>.json`.

---

## 15. GIT WORKFLOW, BACKUP & REVIEW DISCIPLINE

This section is **non-negotiable** and applies to every task in §16.

### 15.1 Branching
- `main` — protected, always shippable.
- `develop` — integration; nightly auto-deploys to `staging.eventhorizon.observatory`.
- `task/<n>-<slug>` — one branch per task in §16. Squash-merged into `develop` on completion.
- `fix/<slug>`, `art/<slug>` — small flights, allowed to skip the task numbering.

### 15.2 Commit cadence
- Commit after every meaningful unit of progress, **at least every 60 minutes of focused work**.
- Conventional Commits: `feat(disk): add Doppler beaming uniform`, `fix(camera): clamp infall mode at r_s+ε`.
- Never commit a broken build to a task branch. Use `wip:` prefix and force-push if you must, but do it on the task branch only.

### 15.3 Tag-based backup
- At the end of each of the 12 tasks, create an annotated tag: `v0.<task#>-<slug>`.
- Push tags to **two** remotes: `origin` (GitHub) and `archive` (a separate Git repo on a personal NAS / second provider).
- Bundle a snapshot: `git bundle create backups/v0.<n>.bundle --all` and store on cold storage (S3 Glacier / Backblaze).
- Verify each bundle restores cleanly before tagging the next task.

### 15.4 Review gates
Each task in §16 lists **mandatory sign-offs**. A task is not "done" until:
1. All listed hats (Aria/Kael/Nova/Vex) have reviewed and signed off in the PR description checklist.
2. CI is green: lint, typecheck, unit, build size, E2E smoke.
3. A human-eyes pass on the deployed staging build.
4. The git tag and bundle are created and verified.
5. The README's "Progress Log" (§16, top of file) is updated with date and tag.

### 15.5 PR template (lives at `.github/pull_request_template.md`)
```
## What
<one paragraph>

## Why
<link the §16 task and any related issue>

## Hats signed off
- [ ] Aria (web design)
- [ ] Kael (system)
- [ ] Nova (art)
- [ ] Vex (science)

## Verification
- [ ] Lint / typecheck green
- [ ] Unit tests added / updated
- [ ] Manual QA on staging
- [ ] No regressions in FPS budget at High tier
- [ ] Screenshots attached (before / after)

## Risk
<what could break>

## Rollback
<how we revert>
```

### 15.6 Backup verification ritual (run before every tag)
```
git fsck --full
git bundle verify backups/v0.<n>.bundle
shasum -a 256 backups/v0.<n>.bundle >> backups/CHECKSUMS.txt
```
The CHECKSUMS file is itself committed and signed.

---

## 16. THE 12 TASKS

> **Progress Log** (update on every tag):
> - [ ] T1 — Foundations
> - [ ] T2 — Render core
> - [ ] T3 — Black-hole physics & shaders
> - [ ] T4 — Environment & skies
> - [ ] T5 — 3D models
> - [ ] T6 — Cameras & navigation
> - [ ] T7 — Simulation engine & scenarios
> - [ ] T8 — UI / control panel
> - [ ] T9 — Live reactivity
> - [ ] T10 — Audio
> - [ ] T11 — Performance, a11y, mobile
> - [ ] T12 — Polish, docs, deploy

Each task below is structured identically:
- **Goal**, **Subtasks** (numbered), **Deliverables**, **Definition of Done**, **Sign-offs**, **Backup ritual**, **Estimated effort**.

---

### TASK 1 — FOUNDATIONS
**Goal:** Stand up a clean, opinionated repo with build pipeline, quality gates, and a first running hello-world canvas.

**Subtasks:**
1. Create monorepo (`pnpm init`), TypeScript strict, Vite app, Biome, Husky, lint-staged.
2. Set up Vitest + Playwright with a smoke test.
3. Add GitHub Actions: lint, typecheck, test, build, **size budget gate** (fail PR over budget §13).
4. Define module boundaries per §7.1 as empty folders + `index.ts` barrels.
5. Add `.editorconfig`, `.nvmrc`, `pnpm-lock.yaml` committed.
6. Render an empty `<canvas>` via Three.js with a single rotating wireframe sphere — proof the loop works.
7. Wire the dev console (`~` key) backed by Tweakpane, behind `import.meta.env.DEV`.
8. Author this README's two architecture diagrams (`arch-diagram.svg`, `render-pipeline.svg`).
9. Configure dual remotes (`origin`, `archive`); document in `docs/CONTRIBUTING.md`.
10. Smoke-test the backup bundle ritual (§15.6) end-to-end.

**Deliverables:** running dev server, green CI, README + CONTRIBUTING + LICENSE, two SVG diagrams, working `~` console.

**Definition of Done:**
- `pnpm dev` shows a wireframe sphere at 60fps on a stock laptop.
- CI on a dummy PR passes all five gates.
- Bundle restoration verified locally.

**Sign-offs:** Kael (lead), Aria (review).

**Backup:** tag `v0.1-foundations`. Bundle. Push to both remotes.

**Estimated effort:** 2 days.

---

### TASK 2 — RENDER CORE
**Goal:** A robust render loop with quality tiers, a post-processing chain stub, and the camera/scene/renderer separated from any black-hole-specific code.

**Subtasks:**
1. Implement `canvas/core/Renderer.ts` with WebGL2; capability probe for WebGPU behind a flag.
2. Implement `Loop.ts` with the three-tick architecture (§7.2). Use a fixed 120Hz physics tick with accumulator.
3. Implement `Clock.ts` exposing `simTime`, `realTime`, `dt`, `timeScale`.
4. Implement quality tier registry from §7.4. Auto-benchmark on first load (3s GPU stress, count frames).
5. Wire EffectComposer with: render pass → bloom → tonemap → output. Each pass switchable per tier.
6. Wire `OrbitControls` as a stand-in camera, plus a debug grid + axes helper.
7. Build the FPS / frame-time chart (HUD widget); writes from a ring buffer.
8. Implement the auto-downgrade / upgrade rules (§13).
9. Hot-reload safety: shader recompiles must not leak GPU memory; verify via `WEBGL_lose_context` cycles in a unit test.
10. Memory-leak Playwright sentinel: idle 60s, assert heap delta < 5MB.

**Deliverables:** loop, renderer, composer, quality tier system, FPS HUD, leak sentinel.

**Definition of Done:**
- Quality auto-selects to High on a Mac M2 and Medium on a 2018 ThinkPad iGPU.
- Frame-time chart visible in dev mode, readable.
- All four tiers manually selectable; downgrade triggers correctly under artificial load.

**Sign-offs:** Kael (lead), Aria (HUD), Nova (visual sanity of bloom default).

**Backup:** tag `v0.2-render-core`. Bundle. Push.

**Estimated effort:** 3 days.

---

### TASK 3 — BLACK-HOLE PHYSICS & SHADERS
**Goal:** Render a recognizable, physically-grounded black hole with gravitational lensing, accretion disk, photon ring, Doppler beaming, and gravitational redshift.

**Subtasks:**
1. Implement `physics/metrics/schwarzschild.ts` and `physics/metrics/kerr.ts`. Pure functions, fully unit-tested against published reference points (e.g., ISCO at a=0 should be 6M).
2. Implement derived quantities (`r_s`, photon sphere, ISCO, ergosphere, Hawking T, lifetime). Unit tests with known values for Sgr A\* and M87\*.
3. Bake the lensing deflection LUT: write a Node-side script (`scripts/bake-lensing.ts`) that integrates null geodesics with RK4 and outputs `assets/lensing-deflection.exr`. Commit script + output; document the math in `docs/physics/lensing.md`.
4. Author `shaders/lensing.frag`: samples the LUT to remap skybox + disk samples around the black hole. Cite the paper in the shader header.
5. Author `shaders/disk.frag`: integrates samples along a slab, samples blackbody LUT by local temperature, applies Doppler beaming (`δ⁴`) and gravitational redshift, mixes turbulence noise.
6. Author `shaders/horizon.frag`: pure-black disk with subtle anisotropic membrane edge.
7. Compose the BH object: skybox → lensing pass → disk → horizon → photon-ring sprite.
8. Add scientist-mode overlay: render r_s, photon sphere, ISCO as wireframe rings (toggleable).
9. Validate: side-by-side comparison screenshots against the EHT M87\* image and the Interstellar/Gargantua reference. Commit screenshots to `docs/visual-validation/`.
10. Performance pass: assert ≤ 6ms for the full BH stack at High on the reference rig.

**Deliverables:** physics module with tests, lensing LUT + bake script, four shaders, BH object, validation screenshots, physics docs.

**Definition of Done:**
- Schwarzschild and Kerr both render with correct qualitative features (asymmetric brightness for Kerr).
- Doppler-bright side and red-dim side are visibly distinct and on the correct axis given disk rotation direction.
- Toggling lensing off and on shows the expected difference.
- All physics unit tests green.

**Sign-offs:** Vex (lead), Nova (visual), Kael (perf).

**Backup:** tag `v0.3-bh-core`. Bundle. Push.

**Estimated effort:** 7 days.

---

### TASK 4 — ENVIRONMENT & SKIES
**Goal:** Hand-author three skybox HDRIs and a procedural starfield + nebula system. The black hole now sits in a place.

**Subtasks:**
1. Paint `sky-deepfield.hdr`: sparse, faint, deep cobalt undertone. Use a procedural star-placement script + manual paint passes; export RGBM cubemap.
2. Paint `sky-galacticcore.hdr`: dense star clouds, brown dust lanes, warm bias. Heavy reference to Milky Way center.
3. Paint `sky-empty.hdr`: near-black with anchor stars only — for clean physics shots.
4. Implement `objects/Skybox.ts`: cube map with smooth blend between presets (3-second lerp).
5. Implement `objects/StarField.ts`: 50k instanced point sprites with parallax, twinkle (subtle), and a magnitude-aware brightness curve.
6. Implement `objects/Nebula.ts`: volumetric-feel raymarched layer (faked with 4 cross-billboards + noise), tinted, low-opacity, cheap.
7. Add controls in the right panel for star density, skybox selection, nebula toggle/tint, dust scattering, cosmological redshift `z` (applies a global wavelength shift to disk + sky).
8. Add a "Companion star" toggle: a sphere with a custom emissive shader, optional spectral class affecting color temperature.
9. HDRI-aware lighting: feed the skybox as the environment for any future PBR models.
10. Validate that lensing samples the chosen skybox and produces correct Einstein-ring-like distortions.

**Deliverables:** three HDRIs, starfield, nebula, companion star, env controls, environment-aware lensing.

**Definition of Done:**
- Switching skyboxes is smooth and visibly changes lensing distortion content.
- Nebula reads as gas, not as a flat plane.
- Cosmological redshift slider visibly shifts colors toward red as `z` increases.

**Sign-offs:** Nova (lead), Vex (redshift correctness), Kael (perf).

**Backup:** tag `v0.4-environment`. Bundle. Push.

**Estimated effort:** 4 days.

---

### TASK 5 — 3D MODELS
**Goal:** A small, hand-modeled cast of objects: probe, observatory ring, debris cluster, plus PBR materials and instancing.

**Subtasks:**
1. Model `probe.glb`: a 1.2k-tri scientific probe with a dish, antenna, solar panels, and running lights. Hand-author 1024² basecolor / normal / roughness / metallic / emissive maps in a single texture atlas.
2. Model `observatory-ring.glb`: a modular ring station, ~8k tris, painted PBR maps. Used in the Idle scenario as the viewer's vantage point.
3. Model `debris-cluster.glb`: 6 distinct rocky chunks for spaghettification scenes; instance with random scale/rotation.
4. Implement an instanced-mesh helper for debris and stars.
5. Implement a `Probe` actor that can be tethered to the camera or run a scripted path (used in Probe Drop scenario).
6. Add a subtle running-lights shader on the probe that blinks at a slow rate.
7. Verify all models load via Draco compression; total model bytes ≤ 1.5 MB.
8. Light-rig the models with the active HDRI; check they read correctly against bright disk and dark sky.
9. Write a `scripts/optimize-glb.ts` to validate every glTF file at build time (vertex count, texture size, draco status).
10. Add a "Show probe" toggle in Camera group.

**Deliverables:** three glTF models with PBR maps, instanced helper, probe actor, validation script.

**Definition of Done:**
- Models render correctly under all three skyboxes.
- File sizes within budget.
- Probe path scenario plays without jitter.

**Sign-offs:** Nova (lead), Aria (silhouette readability), Kael (perf, draw calls).

**Backup:** tag `v0.5-models`. Bundle. Push.

**Estimated effort:** 5 days.

---

### TASK 6 — CAMERAS & NAVIGATION
**Goal:** Five distinct, polished camera modes with seamless transitions between them. Cinematic intro on first load.

**Subtasks:**
1. Implement `cameras/Cinematic.ts`: a GSAP-driven path; 18-second idle loop with 1.5° micro-drift; orchestrates the first-load reveal (slow push from far → mid distance, FoV breath).
2. Implement `cameras/Orbit.ts`: damped orbit controls, pinch/scroll zoom, rotation locked at high inclination near horizon to avoid clipping the disk.
3. Implement `cameras/FreeFly.ts`: WASD + mouse-look, with a clamp at `1.5 r_s` (visual safety, with a "research mode" override).
4. Implement `cameras/Probe.ts`: tethered to the probe model with a slight lag spring.
5. Implement `cameras/Infall.ts`: forward velocity along a radial geodesic; FoV widens as time dilation grows; chromatic aberration ramps; eventual fade-to-white at horizon crossing.
6. Implement `Cameras.transitionTo(mode, duration)`: cross-fade FoV, position, look-at via GSAP, with collision-avoidance through the disk.
7. Add the View-mode pill in the top bar; clicking it routes through `transitionTo`.
8. Add the cinematic intro: 6 seconds, skippable with any input, never replayed automatically.
9. Add the keyboard map (§10.16) and a `?`-modal that documents it.
10. Author tests: every transition leaves the camera in a valid state (no NaN positions, no inverted up-vectors).

**Deliverables:** five camera classes, transition orchestrator, intro choreography, keyboard layer.

**Definition of Done:**
- Switching modes never produces a hitch or a frame of broken view.
- Infall mode produces the expected visual cues without crashing past the horizon.
- Cinematic intro is something you'd put on a demo reel.

**Sign-offs:** Aria (lead, motion), Vex (infall fidelity), Kael (transitions stable).

**Backup:** tag `v0.6-cameras`. Bundle. Push.

**Estimated effort:** 4 days.

---

### TASK 7 — SIMULATION ENGINE & SCENARIOS
**Goal:** A scenario state machine, the eight scripted scenarios from §10.13, the Kerr-Newman path, and the relativistic jet.

**Subtasks:**
1. Implement `sim/Scenario.ts`: a state machine with `init / step / cleanup`, a timeline of keyframed parameter changes, optional per-scenario camera overrides.
2. Implement Scenario 1 — *Idle Observatory*: just the BH and the ring station; auto-orbit slow.
3. Implement Scenario 2 — *Probe Drop*: probe spawns at 10 r_s, falls along radial geodesic; tethered camera optional; Doppler whoosh fades.
4. Implement Scenario 3 — *Spaghettification*: a star (sphere with custom shader) crosses tidal radius; debris cluster spawns; star color shifts as it stretches; particles emit along long axis.
5. Implement Scenario 4 — *Binary Merger*: a second BH spawns at 30 r_s; in-spiral trajectory (analytic post-Newtonian approximation); ringdown; both meld into one BH at `t=t_merge`.
6. Implement Scenario 5 — *Photon-Sphere Echo*: emit a bright pulse at 1.5 r_s on a tangent; render with a stretched glow trail that loops; play subharmonic thud each loop.
7. Implement Scenario 6 — *Jet Flare*: ramp accretion density, brighten jet, audio swell.
8. Implement Scenario 7 — *Hawking Timelapse*: animate `M` decreasing logarithmically over 90s; show clock counting absurd numbers; final flash + silence.
9. Implement Scenario 8 — *Custom Sandbox*: no script; all controls active.
10. Build the relativistic jet object: helical noise mapped to a stretched cylinder, Lorentz-boost color shift, magnetic-field-strength controlled twist.
11. Add Kerr-Newman metric path; gate the Q slider behind the Research toggle; show a banner explaining astrophysical relevance.
12. Wire the Top bar Scenario dropdown and the Bottom HUD timeline scrubber for scripted scenarios.

**Deliverables:** scenario engine, eight scenarios, jet object, Kerr-Newman path.

**Definition of Done:**
- Each scenario plays end-to-end without a crash, freeze, or visible asset pop.
- Scenario transitions cleanly tear down state (no leftover particles or actors).
- Scrubbing the scenario timeline is smooth (no re-init thrash).

**Sign-offs:** Vex (lead, all scenarios), Aria (timeline UX), Kael (state machine), Nova (jet look).

**Backup:** tag `v0.7-scenarios`. Bundle. Push.

**Estimated effort:** 8 days.

---

### TASK 8 — UI / CONTROL PANEL
**Goal:** Ship the full UI per §10. Top bar, left rail, right control panel with all groups, bottom HUD, modals.

**Subtasks:**
1. Build the design-system primitives in `ui/primitives/`: Slider, LogSlider, RangeSlider, Segmented, Toggle, Dropdown, IconButton, Tooltip, Accordion, Modal, Toast.
2. Implement the right control panel as collapsible accordion groups A–I from §10.4–§10.12.
3. Implement the left rail with hover tooltips, scroll-to-group behavior, and keyboard activation.
4. Implement the top bar: scenario dropdown, view-mode pill, share, capture, settings, help.
5. Implement the bottom HUD: telemetry chips bound to `TelemetryStore` (throttled 30Hz writes), play/pause/step/reverse, time-scale log slider, scenario timeline.
6. Implement the Equations panel (Education group): KaTeX render, citations, copy-LaTeX button.
7. Implement the Comparative scale overlay: tween a known object's silhouette over the BH.
8. Implement the keyboard reference modal (`?`).
9. Implement Settings, Share, Capture, About modals.
10. Hand-author all 24+1 SVG icons; build an icon sprite via `vite-plugin-svg-sprite`.
11. Implement focus rings, ARIA roles/labels, reduced-motion handling.
12. Wire the URL state-share format: `?s=<base64-cbor-encoded-state>`; on load, hydrate the store before first frame.

**Deliverables:** full UI per spec, design-system, icon set, modals, URL-state.

**Definition of Done:**
- Every control listed in §10.4–§10.14 is present, wired, and live-affects the simulation.
- Tab-key navigation reaches every interactive element in a sensible order.
- A shared URL reproduces the exact scene on another browser.

**Sign-offs:** Aria (lead), Vex (telemetry/equations correctness), Kael (state-share format), Nova (icons & visual polish).

**Backup:** tag `v0.8-ui`. Bundle. Push.

**Estimated effort:** 9 days.

---

### TASK 9 — LIVE REACTIVITY
**Goal:** Every parameter change updates the simulation **smoothly** in real time. No tearing, no stutters, no shader recompiles on hot params.

**Subtasks:**
1. Audit every control; classify as **uniform-bound** (cheap, lerp directly), **structural** (requires shader define / pipeline rebuild), or **scenario-bound**.
2. Build a `ParamChannel` abstraction: `set(value, lerpMs)` writes to a target; the render tick reads the lerped current value into the uniform.
3. Default lerp times: continuous 240ms cubic, integers immediate, color 320ms linear in OKLCH.
4. For structural changes (metric switch, post-FX toggle on/off), implement a 220ms cross-fade between two render passes to hide the rebuild.
5. Validate no parameter change costs more than 8ms of main-thread work (measure with `performance.measure`).
6. Implement undo/redo for parameter changes (50-step ring buffer); bind to `Cmd/Ctrl+Z`.
7. Implement the Notebook (saved presets): name, thumbnail, JSON state; localStorage persistence.
8. Implement the parameter-history sparkline in the Notebook (last 60s of the active parameter).
9. Add a "Slow-motion compare" mode: split-screen, left = before, right = after, scrubbable.
10. Add a "Reset to default" per group and a global reset.

**Deliverables:** ParamChannel system, structural cross-fade, undo/redo, notebook, slow-motion compare.

**Definition of Done:**
- Sweeping mass `M` from 1 → 10⁹ M_☉ produces a continuous, jitter-free animation.
- Switching metric Schwarzschild ↔ Kerr is visually seamless.
- Notebook reload restores within 200ms.

**Sign-offs:** Kael (lead), Aria (UX of lerps), Vex (no lies introduced by lerping).

**Backup:** tag `v0.9-reactivity`. Bundle. Push.

**Estimated effort:** 5 days.

---

### TASK 10 — AUDIO
**Goal:** A full audio identity. Procedural where possible; samples only for chirp / thud / tick.

**Subtasks:**
1. Set up the Tone.js graph: master → buses (ambient, fx, ui) → out, with a master limiter.
2. Compose the ambient drone: 3-voice detuned synth, 7-note scale, slow LFOs on filter cutoff and amplitude; ~12% CPU on a low-end laptop.
3. Procedural Doppler whoosh: tied to the camera's radial velocity relative to the BH; pitch shifts with `1+v/c` factor.
4. Procedural singularity hum: sub-bass synth, amplitude follows `1/(r-r_s)` clamped, low-pass filter opens as r decreases.
5. Procedural gravitational-wave chirp synthesis (binary merger scenario): instantaneous frequency from a post-Newtonian formula, sweeping from 35Hz → 250Hz over the inspiral, with a ringdown decay; reference GW150914.
6. UI parameter ticks: short pulse for integer changes; sine glide for continuous; throttled to ≤ 12 Hz.
7. Photon-sphere echo thud: pre-rendered sample with a reverse cymbal swell baked in.
8. Implement the Audio panel controls (§10.10) bound to bus gains.
9. Respect autoplay policy: silent until first user interaction; show a subtle "click to enable audio" pill on the canvas.
10. Add `prefers-reduced-motion` analog: a "calm audio" toggle that disables hum/whoosh.

**Deliverables:** audio engine, all procedural voices, two samples, panel wiring.

**Definition of Done:**
- Audio never clips on a default mix.
- Every parameter change has audible feedback (or is explicitly silent by design).
- Muting + unmuting is instant and stable.

**Sign-offs:** Aria (lead), Vex (chirp formula correctness), Kael (CPU budget).

**Backup:** tag `v0.10-audio`. Bundle. Push.

**Estimated effort:** 4 days.

---

### TASK 11 — PERFORMANCE, A11Y, MOBILE
**Goal:** Make it run well everywhere it can run, and degrade with grace where it can't.

**Subtasks:**
1. Build the GPU benchmark: 3-second offscreen render of a stress shader, measure mean frame time, map to tier.
2. Tighten the auto-downgrade rules and surface the toast.
3. Implement the **Cinematic-Mobile** tier: reduced lensing samples, no jet, no debris, simplified disk; gesture-based orbit; fixed lower FoV; no in-fall mode.
4. Touch input: pinch-zoom, two-finger orbit, long-press context.
5. Lighthouse pass: defer all non-critical assets, preconnect, preload critical font, inline critical CSS.
6. Code-splitting: scenarios are lazy modules; only Idle is in the initial bundle.
7. Memory profiling: 10-minute soak, assert no monotonic growth.
8. Accessibility audit: axe + manual keyboard run-through; fix all violations.
9. Reduced motion: confirm camera bob, intro, and HUD transitions are halved or disabled appropriately.
10. i18n: extract all strings; ship `en`, `es`, `ja`; verify long-string layouts (German pseudo-loc as a stress test).
11. Add a "WebGL unavailable" fallback page with the painted hero image and a static info card.
12. E2E test suite covering: cold load, slider sweep, scenario switch, share-URL roundtrip, capture, settings change, fullscreen.

**Deliverables:** mobile tier, a11y compliance, i18n, fallback page, full E2E suite.

**Definition of Done:**
- Lighthouse desktop ≥ 85 perf, ≥ 95 a11y.
- E2E green on Chromium, Firefox, Safari (latest), and Mobile Safari emulation.
- 10-minute soak shows < 10 MB heap growth.

**Sign-offs:** Kael (lead), Aria (a11y/i18n), Nova (visual on mobile), Vex (no scientific regressions on mobile).

**Backup:** tag `v0.11-perf-a11y`. Bundle. Push.

**Estimated effort:** 6 days.

---

### TASK 12 — POLISH, DOCS, DEPLOY
**Goal:** Ship-quality. Docs, credits, hardening, deploy.

**Subtasks:**
1. Onboarding tour (7 steps): welcome → orbit → first slider → scenario → equations → capture → "good luck out there." Skippable, never auto-replayed.
2. About / Credits modal: full citation list (§8), asset attributions, license, a "made by" page.
3. Crash reporter: error boundary with a friendly message, "copy diagnostic" button (anonymized scene state + UA).
4. Capture pipeline: PNG via `toDataURL`; WebM via `MediaRecorder`; stretch goal MP4 via `ffmpeg.wasm` (gated by file-size check).
5. Polish pass on every transition: panel open/close, modal in/out, scenario start/end, slider release.
6. Final color-pass on UI: contrast verified against §9.2 tokens.
7. Author `docs/USER_GUIDE.md` (long-form), `docs/PHYSICS_NOTES.md`, `docs/ARCHITECTURE.md`.
8. Author the OG share card (`og-share.jpg`) and verify Twitter/Facebook/Slack previews.
9. Deploy to Cloudflare Pages with custom domain; mirror to Vercel.
10. Set up uptime monitoring (a simple cron pinger) and a status badge in the README.
11. Write the public launch announcement (blog post + X/Mastodon thread + a 30s teaser video assembled from the capture pipeline).
12. Final dual-remote tag + bundle: `v1.0.0`.

**Deliverables:** tour, credits, crash reporter, capture export, three docs, OG card, production deploy, launch post.

**Definition of Done:**
- A friend with no context can land cold on the URL and reach a "wow" moment in under 60 seconds.
- All four hats sign off.
- Production URL passes Lighthouse + a11y + WebPageTest.

**Sign-offs:** Aria, Kael, Nova, Vex — **all four required**.

**Backup:** tag `v1.0.0-launch`. Bundle. Push to both remotes. Cold-storage upload. SHA-256 checksum committed.

**Estimated effort:** 6 days.

---

## 17. DEFINITION OF DONE (PROJECT-LEVEL)

The project is "done" — and only then — when **all** of these are true:

- All 12 tasks tagged and bundled.
- Production URL live and stable for 7 consecutive days.
- Lighthouse scores meet §4.3 targets on three different machines.
- Cross-browser smoke tests green on Chrome / Firefox / Safari / Edge / Mobile Safari.
- README's Progress Log fully checked.
- All citations in the Equations panel resolve to a real, accessible reference.
- A new contributor can clone, install, and run `pnpm dev` to a working canvas in under 10 minutes following `CONTRIBUTING.md`.
- The project's `archive` remote and one cold-storage location both contain a verified bundle of `v1.0.0`.

---

## 18. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Lensing shader too slow on iGPU | High | High | Bake LUT + low-tier sample count; quality auto-downgrade |
| Scope creep on Kerr-Newman correctness | Med | Med | Gate behind Research flag; reference papers explicitly |
| Audio autoplay blocked silently | High | Low | "Click to enable audio" pill; mute by default |
| Mobile Safari regressions | High | Med | Cinematic-Mobile fallback tier; explicit E2E lane |
| Asset bloat past budget | Med | Med | Build-time size gate; KTX2 + Draco mandatory |
| Color management drift across browsers | Med | Low | Explicit AGX tonemap; sRGB output everywhere |
| GPU memory leak on context loss | Low | High | Dispose audit + Playwright sentinel |
| One-person bus factor | High | High | Document every decision in this README; second remote; cold-storage bundles |

---

## 19. GLOSSARY

- **r_s** — Schwarzschild radius, `2GM/c²`.
- **ISCO** — Innermost stable circular orbit. 6M for Schwarzschild, depends on spin for Kerr.
- **Photon sphere** — Locus where light orbits the BH. 1.5 r_s for Schwarzschild.
- **Ergosphere** — Region around a Kerr BH where frame-dragging forces co-rotation.
- **Doppler beaming** — Apparent brightening of matter moving toward observer; scales as δ⁴.
- **Gravitational redshift** — Photons climbing out of a potential well lose energy.
- **Kerr metric** — Spacetime around a rotating, uncharged BH.
- **Kerr-Newman metric** — Generalization with charge; mostly pedagogical.
- **Lensing LUT** — Look-up texture mapping image-plane direction to deflected source direction.
- **Tonemap (AGX)** — A modern, perceptually-pleasant HDR-to-LDR mapping.

---

*End of document. Update the Progress Log in §16 every time a task ships, and amend any section above with a follow-up commit if reality forces a change. Truth, awe, agency — in that order when they conflict.*
