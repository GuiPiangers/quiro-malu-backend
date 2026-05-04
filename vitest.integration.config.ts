import { defineConfig } from "vitest/config";

/** Config só para `*.int.spec.ts` — o CLI do Vitest não aceita bem glob no argumento posicional. */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/**/*.int.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  },
});
