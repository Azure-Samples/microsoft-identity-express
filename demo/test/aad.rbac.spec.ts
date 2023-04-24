/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Page, Browser, BrowserContext, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import {
    Screenshot,
    createFolder,
    enterCredentials,
    SCREENSHOT_BASE_FOLDER_NAME,
    SAMPLE_HOME_URL,
    clickSignIn,
} from './e2eTestUtils';

const { WebAppAuthProvider } = require('../../dist/index');
const appSettings = require('../App/appSettings');

require('dotenv').config();

// Get flow-specific routes from sample application
const { app, main } = require('../App/app');

test.describe('Role-based Access Control Tests ', () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let port: number;
    let homeRoute: string;

    let username: string;
    let accountPwd: string;
    let leastPrivilegeUsername: string;
    let leastPrivilegeAccountPwd: string;
    let msid: any;

    const screenshotFolder = `${SCREENSHOT_BASE_FOLDER_NAME}/web-app/rbac`;

    test.beforeAll(async () => {
        browser = await chromium.launch();

        port = 5000;
        homeRoute = `http://localhost:${port}`;

        createFolder(screenshotFolder);

        [username, accountPwd] = [process.env.AAD_TEST_USER_USERNAME, process.env.AAD_TEST_USER_PASSWORD];
        [leastPrivilegeUsername, leastPrivilegeAccountPwd] = [
            process.env.ADD_LEAST_PRIVILEGE_TEST_USER_USERNAME,
            process.env.ADD_LEAST_PRIVILEGE_TEST_USER_PASSWORD,
        ];
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.describe('Acquire Token', () => {
        let server: any;

        test.beforeAll(async () => {
            server = app.listen(port);
            msid = await new WebAppAuthProvider.initialize(appSettings);
            main(msid);
        });

        test.afterAll(async () => {
            if (server) {
                server.close();
            }
        });

        test.beforeEach(async () => {
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

        test('User can access protected path with application roles', async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/user-can-access-protected-path-roles`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();
            await page.waitForSelector('#rolesButton');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#rolesButton');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(
                page.locator(`text=You can see this page if you are in TaskUser or TaskAdmin`).first()
            ).toBeVisible();
        });

        test("User can't access protected path with application roles", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/user-can't-access-protected-path-roles`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, leastPrivilegeUsername, leastPrivilegeAccountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${leastPrivilegeUsername}`).first()).toBeVisible();
            await page.waitForSelector('#rolesButton');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#rolesButton');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=Forbidden`).first()).toBeVisible();
        });

        test('User can access protected path with security groups', async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/user-can-access-protected-path-groups`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();
            await page.waitForSelector('#groupsButton');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#groupsButton');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(
                page.locator(`text=You can see this page if you are in GroupMember or GroupAdmin`).first()
            ).toBeVisible();
        });

        test("User can't access protected path with security groups", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/user-can't-access-protected-path-groups`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, leastPrivilegeUsername, leastPrivilegeAccountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${leastPrivilegeUsername}`).first()).toBeVisible();
            await page.waitForSelector('#groupsButton');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#groupsButton');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=Forbidden`).first()).toBeVisible();
        });
    });
});
