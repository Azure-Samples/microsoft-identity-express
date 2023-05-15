/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSettingsHelper } from "../../src/config/AppSettingsHelper";
import { TEST_APP_SETTINGS, TEST_MSAL_CONFIG } from "../TestConstants";

describe("MSAL configuration builder tests", () => {
    it("should instantiate a valid msal configuration object", () => {
        const msalConfig = AppSettingsHelper.getMsalConfiguration(TEST_APP_SETTINGS);

        expect(msalConfig).toBeDefined();

        expect(msalConfig).toMatchObject(TEST_MSAL_CONFIG);
    });
});

describe("Configuration helper tests", () => {

    it("should detect a GUID", () => {
        const guid1 = "0D4C9F3E-A8C5-4D4C-B8B0-C8E8E8E8E8E8";
        const guid2 = "81b8a568-2442-4d53-8d6c-ededab4b7c62";
        const guid3 = "81b8a56824424d538d6cededab4b7c62";
        const guid4 = "Very pleasant pineapple";
        const guid5 = "";

        expect(AppSettingsHelper.isGuid(guid1)).toBe(true);
        expect(AppSettingsHelper.isGuid(guid2)).toBe(true);
        expect(AppSettingsHelper.isGuid(guid3)).toBe(false);
        expect(AppSettingsHelper.isGuid(guid4)).toBe(false);
        expect(AppSettingsHelper.isGuid(guid5)).toBe(false);
    });

    it("should get effective scopes from a given list of scopes", () => {
        const scopes = "email openid profile offline_access User.Read calendars.read".split(" ");
        const effectiveScopes = AppSettingsHelper.getEffectiveScopes(scopes);
        expect(effectiveScopes).toEqual(["User.Read", "calendars.read"]);
        expect(["User.Read", "calendars.read"].every(elem => effectiveScopes.includes(elem))).toBe(true);
    });

});
