import * as THREE from "three";
import type { QualityTier } from "../quality";

/**
 * Stage — owns the WebGLRenderer, the Scene, the Camera, and the
 * single hello-world wireframe sphere that proves the loop is alive.
 *
 * Black-hole-specific objects land in `canvas/objects/` during T3.
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly hero: THREE.Mesh;

  private readonly canvas: HTMLCanvasElement;
  private readonly resizeObserver: ResizeObserver | null;
  private readonly onWindowResize = () => this.handleResize();

  tier: QualityTier;

  constructor(canvas: HTMLCanvasElement, tier: QualityTier) {
    this.canvas = canvas;
    this.tier = tier;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(this.targetPixelRatio());
    this.renderer.setClearColor(0x05060a, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping; // T2 wires AGX

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05060a);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, 0.6, 3.6);
    this.camera.lookAt(0, 0, 0);

    // Hero placeholder: a slowly-rotating wireframe sphere.
    // Stand-in for the black hole. Replaced in T3.
    const geo = new THREE.IcosahedronGeometry(1, 3);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x5be9f5,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    this.hero = new THREE.Mesh(geo, mat);
    this.scene.add(this.hero);

    // Subtle radial backdrop glow so the canvas isn't pure black.
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(1.05, 1.6, 96),
      new THREE.MeshBasicMaterial({
        color: 0x141826,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      }),
    );
    halo.rotation.x = Math.PI / 2;
    this.scene.add(halo);

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(canvas);
    } else {
      this.resizeObserver = null;
      window.addEventListener("resize", this.onWindowResize);
    }
    this.handleResize();
  }

  /** Drives the hero animation each frame. */
  update(dt: number): void {
    this.hero.rotation.y += dt * 0.35;
    this.hero.rotation.x += dt * 0.12;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  setTier(tier: QualityTier): void {
    this.tier = tier;
    this.renderer.setPixelRatio(this.targetPixelRatio());
    this.handleResize();
  }

  dispose(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.onWindowResize);
    this.scene.traverse((o) => {
      if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose();
      const m = (o as THREE.Mesh).material;
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
      else m?.dispose();
    });
    this.renderer.dispose();
    const ctx = this.renderer.getContext();
    const lose = ctx.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  }

  private targetPixelRatio(): number {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    return Math.min(dpr, 2) * this.tier.resolutionScale;
  }

  private handleResize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
