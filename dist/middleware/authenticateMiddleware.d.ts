import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
import { RequestHandler } from "./MiddlewareTypes";
declare function authenticateMiddleware(this: WebAppAuthProvider, options: AuthenticateMiddlewareOptions): RequestHandler;
export default authenticateMiddleware;
