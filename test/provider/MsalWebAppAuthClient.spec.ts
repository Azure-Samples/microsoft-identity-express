/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../../src/provider/WebAppAuthProvider";
import { TEST_APP_SETTINGS } from "../TestConstants";

describe("MSAL web app client tests", () => {
    it("should instantiate msal web app client", async () => {
        const msid = await WebAppAuthProvider.initialize(TEST_APP_SETTINGS);
        
        expect(msid).toBeDefined();
        expect(msid).toBeInstanceOf(WebAppAuthProvider);
    });
});
