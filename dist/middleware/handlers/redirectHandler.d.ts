import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { RequestHandler } from "../MiddlewareTypes";
declare function redirectHandler(this: WebAppAuthProvider): RequestHandler;
export default redirectHandler;
