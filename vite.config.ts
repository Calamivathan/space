import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  appType: "spa",
  resolve: {
    alias: {
      "@": r("./src"),
      "@app": r("./src/app"),
      "@canvas": r("./src/canvas"),
      "@physics": r("./src/physics"),
      "@sim": r("./src/sim"),
      "@state": r("./src/state"),
      "@ui": r("./src/ui"),
      "@audio": r("./src/audio"),
      "@assets": r("./src/assets"),
      "@content": r("./src/content"),
      "@lib": r("./src/lib"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 4173,
  },
});
