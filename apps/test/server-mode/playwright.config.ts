import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4340',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // Use Node.js server in production mode for testing SSR
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4340',
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '4340',
      HOST: '0.0.0.0',
    },
  },
})
