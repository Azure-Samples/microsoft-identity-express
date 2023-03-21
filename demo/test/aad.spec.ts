/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Page, Browser, BrowserContext, chromium } from "playwright";
import { test, expect } from "@playwright/test";
import { CacheKVStore, ConfidentialClientApplication } from "@azure/msal-node";

const { app, main } = require("../App/app");
const MsIdExpress = require("../../dist/index");
const appSettings = require("../App/appSettings");

import {
    Screenshot,
    createFolder,
    enterCredentials,
    enterCredentialsB2C,
    SCREENSHOT_BASE_FOLDER_NAME,
    SAMPLE_HOME_URL,
    clickSignIn,
    clickSignOut,
} from "./e2eTestUtils/e2eTestUtils";

import { NodeCacheTestUtils } from "./e2eTestUtils/NodeCacheTestUtils";

require('dotenv').config();

test.describe("Auth Code AAD Tests", () => {
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
    let msalInstance: ConfidentialClientApplication;
    let tokenCache: CacheKVStore;

    const screenshotFolder = `${SCREENSHOT_BASE_FOLDER_NAME}/web-app/aad`;

    test.beforeAll(async () => {
        browser = await chromium.launch();

        port = 3000;
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

    test.describe("Acquire Token", () => {
        let server: any;

        test.beforeAll(async () => {
            server = app.listen(port);
            //msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();
            msid = await new MsIdExpress.WebAppAuthClientBuilder(appSettings)
                .withKeyVaultCredentials({
                    credentialType: process.env['CREDENTIAL_TYPE'],
                    credentialName: process.env['SECRET_NAME'],
                    keyVaultUrl: process.env['KEY_VAULT_URI'],
                })
                .buildAsync();
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

        test("Sign-in with AAD", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/sign-in-with-aad`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);

            await expect(page.locator(`text=${username}`).first()).toBeVisible();
            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);

            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
        });

        test("Acquire token with AAD", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/acquire-token-with-aad`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();
            await page.waitForSelector('#acquireTokenGraph');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#acquireTokenGraph');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await screenshot.takeScreenshot(page, 'samplePageAcquireTokenCallGraph');
            await expect(page.locator(`text=Calling Microsoft Graph API`).first()).toBeVisible();
            await expect(page.locator(`text=${username}`).first()).toBeVisible();

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
        });

        test("Sign-out with AAD", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/sign-out-with-aad`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();

            await clickSignOut(page, screenshot);
            await page.locator(`text=${username}`).click();
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await screenshot.takeScreenshot(page, 'samplePagePostLogout');
            await expect(page.locator(`text=${username}`).first()).not.toBeVisible();
            await expect(page.locator(`text=Sign-in to access your resources`).first()).toBeVisible();

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(0);
            expect(cachedTokens.idTokens.length).toBe(0);
            expect(cachedTokens.refreshTokens.length).toBe(0);
        });

        test("Acquire tokens for multi-resources from ADD", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/acquire-token-for-multi-resource`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentials(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();

            await page.waitForSelector('#acquireTokenGraph');
            await screenshot.takeScreenshot(page, 'samplePagePostLogin');
            page.click('#acquireTokenGraph');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await screenshot.takeScreenshot(page, 'samplePageAcquireTokenCallGraph');
            await expect(page.locator(`text=Calling Microsoft Graph API`).first()).toBeVisible();

            await page.goBack();
            await screenshot.takeScreenshot(page, 'samplePageAcquireTokenCallArm');
            await page.waitForSelector('#acquireTokenArm');
            page.click('#acquireTokenArm');
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=Calling Azure Resource Manager API`).first()).toBeVisible();

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(2);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
        });

        test("User can access protected path with application roles", async () => {
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

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
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
            await expect(page.locator(`text=unauthorized`).first()).toBeVisible();

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
        });

        test("User can access protected path with security groups", async () => {
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

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
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
            await expect(page.locator(`text=unauthorized`).first()).toBeVisible();

            const cachedTokens = NodeCacheTestUtils.getTokens(tokenCache);
            expect(cachedTokens.accessTokens.length).toBe(1);
            expect(cachedTokens.idTokens.length).toBe(1);
            expect(cachedTokens.refreshTokens.length).toBe(1);
        });

        test("Sign-in with B2C", async () => {
            const screenshot = new Screenshot(`${screenshotFolder}/sign-in-with-b2c`);
            await page.goto(homeRoute);
            await clickSignIn(page, screenshot);
            await enterCredentialsB2C(page, screenshot, username, accountPwd);
            await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
            await expect(page.locator(`text=${username}`).first()).toBeVisible();
        });

        test("Sign-out with B2C", async () => {
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
