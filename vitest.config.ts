import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/**/*.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov", "clover"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/app.ts",
        "src/router.ts",
        "src/server.ts",
        "**/**/index.ts",
        "src/config/**",
        "src/repositories/**",
        "src/database/**",
        "**/**/controllers/**",
        "**/*.spec.ts",
        "**/node_modules/**",
      ],
    },
  },
});
