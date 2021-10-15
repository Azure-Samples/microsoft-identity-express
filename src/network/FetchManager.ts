/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { StringUtils } from "@azure/msal-common";

import {
    AccessControlConstants,
    ErrorMessages
} from "../utils/Constants";

export class FetchManager {

    /**
     * Calls a resource endpoint
     * @param {string} endpoint
     * @returns {Promise}
     */
    static callApiEndpoint = async (endpoint: string): Promise<AxiosResponse> => {
        try {
            const response: AxiosResponse = await axios.get(endpoint);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint 
     * @param {string} accessToken 
     * @returns {Promise}
     */
    static callApiEndpointWithToken = async (endpoint: string, accessToken: string): Promise<AxiosResponse> => {

        if (StringUtils.isEmpty(accessToken)) {
            throw new Error(ErrorMessages.TOKEN_NOT_FOUND)
        }

        const options: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        try {
            const response: AxiosResponse = await axios.get(endpoint, options);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    /**
     * Handles queries against Microsoft Graph that return multiple pages of data  
     * @param {string} accessToken: access token required by endpoint 
     * @param {string} nextPage: next page link
     * @param {Array} data: stores data from each page
     * @returns {Promise}
     */
    static handlePagination = async (accessToken: string, nextPage: string, data: string[] = []): Promise<string[]> => {

        try {
            const graphResponse = await FetchManager.callApiEndpointWithToken(nextPage, accessToken);
            graphResponse["value"].map((v) => data.push(v.id));

            if (graphResponse[AccessControlConstants.PAGINATION_LINK]) {
                return await FetchManager.handlePagination(accessToken, graphResponse[AccessControlConstants.PAGINATION_LINK], data)
            } else {
                return data;
            }
        } catch (error) {
            return error;
        }
    }
}
