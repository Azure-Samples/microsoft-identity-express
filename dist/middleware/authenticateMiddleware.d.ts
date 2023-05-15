import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
import { RequestHandler } from "./MiddlewareTypes";
/**
 * Authenticates incoming requests using the WebAppAuthProvider
 * @param {WebAppAuthProvider} this
 * @param {AuthenticateMiddlewareOptions} options
 * @returns {RequestHandler}
 */
declare function authenticateMiddleware(this: WebAppAuthProvider, options: AuthenticateMiddlewareOptions): RequestHandler;
export default authenticateMiddleware;
