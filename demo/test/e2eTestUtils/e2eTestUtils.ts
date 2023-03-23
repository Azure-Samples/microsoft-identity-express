import { Page, Response } from "playwright";
import * as fs from "fs";


// Constants
export const SCREENSHOT_BASE_FOLDER_NAME = `${__dirname}/screenshots`;
export const SAMPLE_HOME_URL = "http://localhost";

export class Screenshot {
    private folderName: string;
    private screenshotNum: number;

    constructor(foldername: string) {
        this.folderName = foldername;
        this.screenshotNum = 0;
        createFolder(this.folderName);
    }

    async takeScreenshot(page: Page, screenshotName: string): Promise<void> {
        await page.screenshot({ path: `${this.folderName}/${++this.screenshotNum}_${screenshotName}.png` });
    }
}

export function createFolder(foldername: string) {
    if (!fs.existsSync(foldername)) {
        fs.mkdirSync(foldername, { recursive: true });
    }
}

export async function enterCredentials(page: Page, screenshot: Screenshot, username: string, accountPwd: string): Promise<void> {
    await Promise.all([
        page.waitForSelector("#i0116"),
        page.waitForSelector("#idSIButton9")
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, "errorPage").catch(() => { });
        throw e;
    });

    await screenshot.takeScreenshot(page, "loginPage");
    await page.type("#i0116", username);
    await screenshot.takeScreenshot(page, "loginPageUsernameFilled")

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}),
        page.click('#idSIButton9'),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    await page.waitForSelector("#idA_PWD_ForgotPassword");
    await page.waitForSelector("#i0118");
    await page.waitForSelector("#idSIButton9");
    await screenshot.takeScreenshot(page, "pwdInputPage");
    await page.type("#i0118", accountPwd);
    await screenshot.takeScreenshot(page, "loginPagePasswordFilled");
    await page.click("#idSIButton9");

    await Promise.all([
        page.click('input#idSIButton9'),
        // Wait either for another navigation to Keep me signed in page or back to redirectUri
        Promise.race([
            page.waitForURL('networkidle').catch(() => {}),
            page.waitForResponse((response: Response) => response.url().startsWith('http://localhost'), { timeout: 0 }),
        ]),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    if (page.url().startsWith("http://localhost")) {
        return;
    }
}

export async function enterCredentialsB2C(page: Page, screenshot: Screenshot, username: string | undefined, accountPwd: string): Promise<void> {
    await Promise.all([
        page.waitForSelector('#email').catch(() => {}),
        page.waitForSelector('#password').catch(() => {}),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    await screenshot.takeScreenshot(page, "loginPageB2C");
    await page.type("#email", username);
    await page.type("#password", accountPwd);
    await screenshot.takeScreenshot(page, 'loginPageUsernameAndPasswordFilled');

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}),
        page.click('#next'),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

}

export async function enterCredentialsADFS(page: Page, screenshot: Screenshot, username: string, accountPwd: string): Promise<void> {
    await Promise.all([
        page.waitForSelector("#i0116"),
        page.waitForSelector("#idSIButton9")
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, "errorPage").catch(() => { });
        throw e;
    });

    await screenshot.takeScreenshot(page, "loginPageADFS");
    await page.type("#i0116", username);
    await screenshot.takeScreenshot(page, "loginPageUsernameFilled");

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}),
        page.click('#idSIButton9'),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    await page.waitForSelector("#passwordInput");
    await page.waitForSelector("#submitButton");
    await page.type("#passwordInput", accountPwd);
    await screenshot.takeScreenshot(page, "passwordEntered");

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.click('#submitButton'),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });
}

export async function clickSignIn(page: Page, screenshot: Screenshot): Promise<void> {
    await page.waitForSelector("#SignIn")
    await screenshot.takeScreenshot(page, "samplePageInit");

    page.click("#SignIn");

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    await screenshot.takeScreenshot(page, "signInClicked");
}

export async function clickSignOut(page: Page, screenshot: Screenshot): Promise<void> {
    await page.waitForSelector("#SignOut")
    await screenshot.takeScreenshot(page, "samplePageSignout");
    page.click("#SignOut");

    await Promise.all([
        page.waitForURL('load').catch(() => {}), // Wait for navigation but don't throw due to timeout
        page.waitForURL('domcontentloaded').catch(() => {}),
        page.waitForURL('networkidle').catch(() => {}),
    ]).catch(async (e) => {
        await screenshot.takeScreenshot(page, 'errorPage').catch(() => {});
        throw e;
    });

    await screenshot.takeScreenshot(page, "signOutClicked");
}
