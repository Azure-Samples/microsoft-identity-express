/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CryptoUtils } from "../../src/utils/CryptoUtils";

describe("Crypto utilities tests", () => {
    const cryptoUtils = new CryptoUtils();

    const state = {
        stage: "signin",
        path: "/redirect",
        nonce: "3acxw4be-0740-4c63-8a09-4f7fb56d1c979",
    };

    const stringifiedData = JSON.stringify(state);
    const key = cryptoUtils.createKey("password", "salt");

    it("should generate a valid instance", () => {
        expect(cryptoUtils).toBeInstanceOf(CryptoUtils);
    });

    it("should encrypt a given stringified object", () => {
        const encryptedData = cryptoUtils.encryptData(stringifiedData, key);

        expect(encryptedData).toBeDefined();
    });

    it("should decrypt a given encrypted string", () => {
        const encryptedData = cryptoUtils.encryptData(stringifiedData, key);
        const decryptedData = cryptoUtils.decryptData(encryptedData, key);

        expect(decryptedData).toBe(stringifiedData);
        expect(JSON.parse(decryptedData)).toMatchObject(state);
    });
});
