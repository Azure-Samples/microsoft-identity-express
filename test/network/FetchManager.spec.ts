/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { FetchManager } from "../../src/network/FetchManager";
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/utils";

jest.mock("axios");

describe("Fetch manager tests", () => {

    // Mock successful response
    const axiosResponse: AxiosResponse = {
        data: {
            title: "mock axios response",
            body: "this is mock data",
        },
        status: 200,
        statusText: "OK",
        config: {},
        headers: {},
    };

    it("should fetch data from an unprotected endpoint", async () => {
        mocked(axios.get).mockResolvedValueOnce(axiosResponse);
        const result = await FetchManager.callApiEndpoint("url");
        expect(result).toMatchObject(axiosResponse.data);
    });
});
