import { AccountInfo } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { RequestContext, RequestHandler } from "../MiddlewareTypes";
import { LoginOptions, LogoutOptions, TokenRequestOptions } from "../MiddlewareOptions";
/**
 *
 */
export declare class AuthContext {
    private provider;
    private context;
    /**
     *
     * @param provider
     * @param context
     */
    constructor(provider: WebAppAuthProvider, context: RequestContext);
    /**
     * Initiates login flow
     * @param {LoginOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    login(options?: LoginOptions): RequestHandler;
    /**
     * Initiates logout flow and destroys the current session
     * @param {LogoutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    logout(options?: LogoutOptions): RequestHandler;
    /**
     * Acquires an access token for given scopes
     * @param {TokenRequestOptions} options: options to modify token request
     * @returns {RequestHandler}
     */
    acquireToken(options?: TokenRequestOptions): RequestHandler;
    /**
     * Returns the account object from the session
     * @returns {AccountInfo} account object
     */
    getAccount(): AccountInfo;
    /**
     * Returns true if the account object is not null
     * @returns {boolean} authentication status
     */
    isAuthenticated(): boolean;
    /**
     * Returns the cached token for a given resource
     * @param {string} resourceName: name of resource to retrieve token for
     * @returns {string | null} cached access token
     */
    getCachedTokenForResource(resourceName: string): string | null;
}
