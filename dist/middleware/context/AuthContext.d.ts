import { AccountInfo } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { SignInOptions, SignOutOptions, TokenRequestOptions } from "../MiddlewareOptions";
declare type RequestContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};
export declare class AuthContext {
    provider: WebAppAuthProvider;
    context: RequestContext;
    constructor(provider: WebAppAuthProvider, context: RequestContext);
    /**
     * Initiates sign in flow
     * @param {SignInOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    signIn(options?: SignInOptions): RequestHandler;
    /**
     * Initiate sign out and destroy the session
     * @param {SignOutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    signOut(options?: SignOutOptions): RequestHandler;
    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options?: TokenRequestOptions): RequestHandler;
    getAccount(): AccountInfo;
    isAuthenticated(): boolean;
    getCachedTokenForResource(resource: string): string | null;
}
export {};
