import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
import { RequestHandler } from "./MiddlewareTypes";
/**
 * Initialize AuthProvider and set default routes and handlers
 * @returns {Router}
 */
declare function authenticateMiddleware(this: WebAppAuthProvider, options: AuthenticateMiddlewareOptions): RequestHandler;
export default authenticateMiddleware;
