import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LogoutOptions } from "../MiddlewareOptions";
import { RequestHandler } from "../MiddlewareTypes";
declare function logoutHandler(this: WebAppAuthProvider, options: LogoutOptions): RequestHandler;
export default logoutHandler;
