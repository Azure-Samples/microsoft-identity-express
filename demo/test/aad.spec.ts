/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Page, Browser, BrowserContext, chromium } from "playwright";
import { test, expect, } from "@playwright/test";

import {
  Screenshot, createFolder, enterCredentials,
  SCREENSHOT_BASE_FOLDER_NAME,
  SAMPLE_HOME_URL,
  clickSignIn
} from "./e2eTestUtils";

require('dotenv').config();

// Get flow-specific routes from sample application
const expressApp = require("../App/app");

test.describe("Auth Code AAD Tests", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let port: number;
  let homeRoute: string;

  let username: string;
  let accountPwd: string;

  const screenshotFolder = `${SCREENSHOT_BASE_FOLDER_NAME}/web-app/aad`;

  test.beforeAll(async () => {
    browser = await chromium.launch();

    port = 4000;
    homeRoute = `http://localhost:${port}`;

    createFolder(screenshotFolder);

    [username, accountPwd] = [process.env.AAD_TEST_USER_USERNAME, process.env.AAD_TEST_USER_PASSWORD];
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.describe("Acquire Token", () => {
    let server: any;

    test.beforeAll(async () => {
      server = expressApp.listen(port);
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
      page.on("dialog", async dialog => {
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
    });
  });
});
