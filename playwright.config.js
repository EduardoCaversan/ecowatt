import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/ui.json' }], ['junit', { outputFile: 'test-results/ui.xml' }]],
  use: { baseURL: process.env.APP_URL || 'http://127.0.0.1:4173/ecowatt/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: process.env.APP_URL ? undefined : { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173/ecowatt/', reuseExistingServer: false }
});
