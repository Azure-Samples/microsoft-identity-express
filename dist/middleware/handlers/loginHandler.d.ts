import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { SignInOptions } from "../MiddlewareOptions";
import { RequestHandler } from "../MiddlewareTypes";
declare function loginHandler(this: WebAppAuthProvider, options: SignInOptions): RequestHandler;
export default loginHandler;
