import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
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
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "src/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/**/index.ts"],
    },
  },
});
