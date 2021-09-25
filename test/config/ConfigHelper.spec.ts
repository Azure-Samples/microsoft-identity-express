/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSettings } from '../../src/config/AppSettings';
import { ConfigHelper } from '../../src/config/ConfigHelper';
import { TEST_APP_SETTINGS } from '../TestConstants';

describe('ClientConfiguration tests', () => {
    it('Gets resource name from a given list of scopes', () => {
        const appSettings: AppSettings = TEST_APP_SETTINGS;
        const scopes = TEST_APP_SETTINGS.protectedResources.armAPI.scopes;
        const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, appSettings);
        expect(resourceName).toEqual(Object.keys(TEST_APP_SETTINGS.protectedResources)[1]);
    });

    it('Gets scopes from a given endpoint in the settings file', () => {
        const appSettings: AppSettings = TEST_APP_SETTINGS;
        const endpoint = TEST_APP_SETTINGS.protectedResources.armAPI.endpoint;
        const scopes = ConfigHelper.getScopesFromResourceEndpoint(endpoint, appSettings);
        expect(scopes).toEqual(TEST_APP_SETTINGS.protectedResources.armAPI.scopes);
    });

    it('Gets effective scopes from a given list of scopes', () => {
        const scopes = ["openid", "email", "User.Read", "calendars.read"];
        const effectiveScopes = ConfigHelper.getEffectiveScopes(scopes);
        expect(effectiveScopes).toEqual(["User.Read", "calendars.read"]);
    });
    
})