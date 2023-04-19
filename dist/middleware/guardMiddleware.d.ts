import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RouteGuardOptions } from "./MiddlewareOptions";
import { RequestHandler } from "./MiddlewareTypes";
declare function guardMiddleware(this: WebAppAuthProvider, options: RouteGuardOptions): RequestHandler;
export default guardMiddleware;
