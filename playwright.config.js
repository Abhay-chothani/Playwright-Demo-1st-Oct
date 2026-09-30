import { defineConfig, devices } from '@playwright/test';

/**
 * Professional Playwright Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for */
  timeout: 60 * 1000,

  expect: {
    /* Maximum time expect() waits for a condition */
    timeout: 10 * 1000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only or configured for robustness */
  retries: process.env.CI ? 2 : 0,

  /* Number of parallel workers */
  workers: process.env.CI ? 1 : undefined,

  /* HTML reporter generates rich test execution reports */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'https://www.girirajdigital.com',

    /* Trace recorded on first retry for debugging */
    trace: 'on-first-retry',

    /* Take screenshot only when a test fails */
    screenshot: 'only-on-failure',

    /* Retain video recording only on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
