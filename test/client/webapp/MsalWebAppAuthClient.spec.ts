/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthClientBuilder } from "../../../src/client/webapp/WebAppAuthClientBuilder";
import { MsalWebAppAuthClient } from "../../../src/client/webapp/MsalWebAppAuthClient";
import { TEST_APP_SETTINGS } from "../../TestConstants";

import { AppServiceEnvironmentVariables } from "../../../src/utils/Constants";

describe("MSAL web app client tests", () => {
    process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_ENABLED] = "False";
    const msid = new WebAppAuthClientBuilder(TEST_APP_SETTINGS).build();

    it("should instantiate msal web app client", () => {
        expect(msid).toBeDefined();
        expect(msid).toBeInstanceOf(MsalWebAppAuthClient);
    });
});
