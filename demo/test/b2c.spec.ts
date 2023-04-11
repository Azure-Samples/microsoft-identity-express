/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Page, Browser, BrowserContext, chromium } from 'playwright';
import { test, expect } from '@playwright/test';
import { CacheKVStore, ConfidentialClientApplication } from '@azure/msal-node';

const { app, main } = require('../App/app');
const appSettings = require('../App/appSettingsB2C');
const WebAppAuthClientPerformanceWrapper = require('../App/auth/WebAppAuthClientPerformanceWrapper')

import {
    Screenshot,
    createFolder,
    enterCredentialsB2C,
    SCREENSHOT_BASE_FOLDER_NAME,
    SAMPLE_HOME_URL,
    clickSignIn,
    clickSignOut,
} from './e2eTestUtils/e2eTestUtils';

require('dotenv').config();

test.describe('Auth Code B2C Tests', () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let port: number;
    let homeRoute: string;

    let username: string;
    let accountPwd: string;

    let msid: any;
    let msalInstance: ConfidentialClientApplication;
    let tokenCache: CacheKVStore;

    const screenshotFolder = `${SCREENSHOT_BASE_FOLDER_NAME}/web-app/B2C`;

    test.beforeAll(async () => {
        browser = await chromium.launch();

        port = 3000;
        homeRoute = `http://localhost:${port}`;

        createFolder(screenshotFolder);

        [username, accountPwd] = [process.env.B2C_TEST_USER_USERNAME, process.env.B2C_TEST_USER_PASSWORD];
    
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.describe('Acquire Token', () => {
        let server: any;

        test.beforeAll(async () => {
            server = app.listen(port);
            msid = new WebAppAuthClientPerformanceWrapper(appSettings).getWebAppAuthClientBuilderInstance();
            msalInstance = msid.getMsalClient();
            tokenCache = msalInstance.getTokenCache().getKVStore();
            main(msid);
        });

        test.afterAll(async () => {
            if (server) {
                server.close();
            }
        });

        test.beforeEach(async () => {
            msalInstance = msid.getMsalClient();
            await msalInstance.storage.clear();
            context = await browser.newContext();
            page = await context.newPage();
            page.setDefaultTimeout(5000);
            page.on('dialog', async (dialog) => {
                console.log(dialog.message());
                await dialog.dismiss();
            });
        });

        test.afterEach(async () => {
            await page.close();
            await context.close();
        });

        test('Sign-in with B2C', async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/sign-in-with-b2c`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentialsB2C(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();
        });

        test('Sign-out with B2C', async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/sign-out-with-b2c`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentialsB2C(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();

            await clickSignOut(page, screenshot);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await screenshot.takeScreenshot(page, 'samplePagePostLogout');
            await expect(page.locator(`text=${username}`).first()).not.toBeVisible();
            await expect(page.locator(`text=Sign-in to access your resources`).first()).toBeVisible();
        });
    });
});
