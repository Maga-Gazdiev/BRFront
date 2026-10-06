import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:18073',
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH ||
        (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined),
      args: ['--no-sandbox'],
    },
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node scripts/test-api.mjs',
      url: 'http://127.0.0.1:18082/healthz',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev -- --port 18073 --strictPort',
      url: 'http://127.0.0.1:18073',
      env: { BACKEND_URL: 'http://127.0.0.1:18082' },
      reuseExistingServer: false,
    },
  ],
});
