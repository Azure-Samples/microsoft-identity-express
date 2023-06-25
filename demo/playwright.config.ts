
import { PlaywrightTestConfig } from "@playwright/test";
import * as path from 'path';

const config: PlaywrightTestConfig = {
    testDir: path.join(__dirname, '/test'),
    use: {
        headless: true,
        trace: 'on-first-retry',
    },
    timeout: 30000,
    globalTimeout: 5400000,
    retries: 3,
    workers: process.env.CI ? 1 : undefined,
};

export default config;
