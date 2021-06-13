import { AxiosResponse } from "axios";
export declare class FetchManager {
    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint
     * @param {string} accessToken
     * @returns {Promise}
     */
    callApiEndpoint: (endpoint: string, accessToken: string) => Promise<AxiosResponse>;
}
