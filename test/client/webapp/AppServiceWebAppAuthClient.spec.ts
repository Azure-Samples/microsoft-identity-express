/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthClientBuilder  } from "../../../src/client/webapp/WebAppAuthClientBuilder";
import { AppServiceWebAppAuthClient } from "../../../src/client/webapp/AppServiceWebAppAuthClient";
import { TEST_APP_SETTINGS } from "../../TestConstants";

import { AppServiceEnvironmentVariables } from "../../../src/utils/Constants";

describe('App Service web app client tests', () => {

    process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_ENABLED]= "True";
    const msid = new WebAppAuthClientBuilder(TEST_APP_SETTINGS).build();

    it('should instantiate app service web app client', () => {
        expect(msid).toBeDefined();
        expect(msid).toBeInstanceOf(AppServiceWebAppAuthClient);
    });
})