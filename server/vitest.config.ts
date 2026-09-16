import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    env: {
      JWT_SECRET: "toktickit-lab3-vitest-test-secret-only",
    },
  },
});
