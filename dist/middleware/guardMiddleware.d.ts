import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RequestHandler } from "./MiddlewareTypes";
import { RouteGuardOptions } from "./MiddlewareOptions";
declare function guardMiddleware(this: WebAppAuthProvider, options: RouteGuardOptions): RequestHandler;
export default guardMiddleware;
