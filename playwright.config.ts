import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e/lab-02",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "tablet",
      use: { viewport: { width: 820, height: 1180 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 393, height: 851 } },
    },
  ],
  webServer: [
    {
      command: "npm run seed && npm --prefix server run build && node server/dist/src/index.js",
      url: `${API_URL}/api/categories`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm --prefix client run dev -- --port 5173 --strictPort",
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});