export declare class FetchManager {
    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint
     * @param {string} accessToken
     * @returns {Promise}
     */
    static callApiEndpoint: (endpoint: string, accessToken: string) => Promise<any>;
    /**
     * @param {string} accessToken
     * @param {string} nextPage
     * @param {Array} userGroups
     * @returns {Promise}
     */
    static handlePagination: (accessToken: string, nextPage: string, userGroups?: string[]) => Promise<any>;
}
