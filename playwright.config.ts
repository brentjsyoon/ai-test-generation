import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  timeout: 240 * 1000,
  retries: 0,

  expect: {
    timeout: 5 * 1000,
  },

  use: {
    screenshot: 'on-first-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    browserName: 'chromium',
    headless: false,

    viewport: null,
    launchOptions: {
      args: [
        '--disable-http2',
        '--start-maximized',
      ],
    },
  },
});