/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebApiAuthClientBuilder  } from "../../../src/client/webapi/WebApiAuthClientBuilder";
import { MsalWebApiAuthClient } from "../../../src/client/webapi/MsalWebApiAuthClient";
import { TEST_APP_SETTINGS } from "../../TestConstants";

describe('MSAL web api client tests', () => {

    const msid = new WebApiAuthClientBuilder(TEST_APP_SETTINGS).build();

    it('should instantiate msal web api client', () => {
        expect(msid).toBeDefined();
        expect(msid).toBeInstanceOf(MsalWebApiAuthClient);
    });
})