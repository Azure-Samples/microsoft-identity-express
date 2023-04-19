import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { SignOutOptions } from "../MiddlewareOptions";
import { RequestHandler } from "../MiddlewareTypes";
declare function logoutHandler(this: WebAppAuthProvider, options: SignOutOptions): RequestHandler;
export default logoutHandler;
