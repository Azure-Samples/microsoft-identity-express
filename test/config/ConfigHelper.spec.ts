/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSettings } from '../../src/config/AppSettings';
import { ConfigHelper } from '../../src/config/ConfigHelper';
import { TEST_APP_SETTINGS } from '../TestConstants';

describe('Configuration helper tests', () => {
    
    it('should detect a GUID', () => {
        const guid1 = "0D4C9F3E-A8C5-4D4C-B8B0-C8E8E8E8E8E8";
        const guid2 = "81b8a568-2442-4d53-8d6c-ededab4b7c62"
        const guid3 = "81b8a56824424d538d6cededab4b7c62";
        const guid4 = "Very pleasant pineapple";
        const guid5 = "";

        expect(ConfigHelper.isGuid(guid1)).toBe(true);
        expect(ConfigHelper.isGuid(guid2)).toBe(true);
        expect(ConfigHelper.isGuid(guid3)).toBe(false);
        expect(ConfigHelper.isGuid(guid4)).toBe(false);
        expect(ConfigHelper.isGuid(guid5)).toBe(false);
    });

    it('should get resource name from a given list of scopes', () => {
        const appSettings: AppSettings = TEST_APP_SETTINGS;
        const scopes = TEST_APP_SETTINGS.protectedResources.armAPI.scopes;
        const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, appSettings);
        expect(resourceName).toEqual(Object.keys(TEST_APP_SETTINGS.protectedResources)[1]);
    });

    it('should get scopes from a given endpoint in the settings file', () => {
        const appSettings: AppSettings = TEST_APP_SETTINGS;
        const endpoint = TEST_APP_SETTINGS.protectedResources.armAPI.endpoint;
        const scopes = ConfigHelper.getScopesFromResourceEndpoint(endpoint, appSettings);
        expect(scopes).toEqual(TEST_APP_SETTINGS.protectedResources.armAPI.scopes);
    });

    it('should get effective scopes from a given list of scopes', () => {
        const scopes = "email openid profile User.Read calendars.read".split(" ");
        const effectiveScopes = ConfigHelper.getEffectiveScopes(scopes);
        expect(effectiveScopes).toEqual(["User.Read", "calendars.read"]);
        expect(["User.Read", "calendars.read"].every(elem => effectiveScopes.includes(elem))).toBe(true);
    });
    
})