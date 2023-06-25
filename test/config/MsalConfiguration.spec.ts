/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Constants } from "@azure/msal-common";

import { MsalConfiguration } from "../../src/config/MsalConfiguration";
import { TEST_APP_SETTINGS } from "../TestConstants";
import { DEFAULT_LOGGER_OPTIONS } from "../../src/utils/Constants";

describe("MSAL configuration builder tests", () => {
    it("should instantiate a valid msal configuration object", () => {
        const msalConfig = MsalConfiguration.getMsalConfiguration(TEST_APP_SETTINGS);

        expect(msalConfig).toBeDefined();

        expect(msalConfig).toMatchObject({
            auth: {
                clientId: TEST_APP_SETTINGS.appCredentials.clientId,
                authority: `https://${Constants.DEFAULT_AUTHORITY_HOST}/${TEST_APP_SETTINGS.appCredentials.tenantId}`,
                clientSecret: TEST_APP_SETTINGS.appCredentials.clientSecret,
                knownAuthorities: []
            },
            system: {
                loggerOptions: DEFAULT_LOGGER_OPTIONS,
            }
        });
    });
});
