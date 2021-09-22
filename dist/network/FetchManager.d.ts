import { AxiosResponse } from "axios";
export declare class FetchManager {
    /**
     * Calls a resource endpoint
     * @param {string} endpoint
     * @returns {Promise}
     */
    static callApiEndpoint: (endpoint: string) => Promise<AxiosResponse>;
    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint
     * @param {string} accessToken
     * @returns {Promise}
     */
    static callApiEndpointWithToken: (endpoint: string, accessToken: string) => Promise<AxiosResponse>;
    /**
     * Handles queries against Microsoft Graph that return multiple pages of data
     * @param {string} accessToken: access token required by endpoint
     * @param {string} nextPage: next page link
     * @param {Array} data: stores data from each page
     * @returns {Promise}
     */
    static handlePagination: (accessToken: string, nextPage: string, data?: string[]) => Promise<string[]>;
}
