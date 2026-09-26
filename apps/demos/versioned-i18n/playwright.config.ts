import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4336',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // --ignore-lock keeps Astro from detaching the server when it detects an
    // AI agent, which Playwright would report as an early exit.
    command: 'npx astro preview --host 0.0.0.0 --port 4336 --ignore-lock',
    url: 'http://localhost:4336',
    reuseExistingServer: !process.env.CI,
  },
})
