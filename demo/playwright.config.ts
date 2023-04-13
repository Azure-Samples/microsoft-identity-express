
import { defineConfig } from '@playwright/test';
import * as path from 'path';
import type { TestOptions } from './test/testOptions';

export default defineConfig<TestOptions>({
    reporter: './test/TestReporter.ts',
    testDir: path.join(__dirname, '/test'),
    use: {
        headless: true,
        trace: 'on-first-retry',
    },
    projects: [
    {
      name: 'auth-code-single-no-cache',
      use: { output: '../reports/measurements.txt', port:"000", testName: "auth-code-single-no-cache" },
    },
    {
      name: 'auth-code-with-cache',
      use: { output: '../reports/measurements.txt', port:"001", testName: "auth-code-with-cache" },
    },
],
    timeout: 30000,
    globalTimeout: 5400000,
    retries: 3,
    workers: process.env.CI ? 1 : undefined,
});