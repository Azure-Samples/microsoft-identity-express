import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LoginOptions } from "../MiddlewareOptions";
import { RequestHandler } from "../MiddlewareTypes";
declare function loginHandler(this: WebAppAuthProvider, options: LoginOptions): RequestHandler;
export default loginHandler;
