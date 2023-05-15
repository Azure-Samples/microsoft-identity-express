import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { RequestHandler } from "../MiddlewareTypes";
import { TokenRequestOptions } from "../MiddlewareOptions";
declare function acquireTokenHandler(this: WebAppAuthProvider, options: TokenRequestOptions, useAsMiddleware?: boolean): RequestHandler;
export default acquireTokenHandler;
