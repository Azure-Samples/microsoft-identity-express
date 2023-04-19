import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { ErrorRequestHandler } from "./MiddlewareTypes";
declare function unauthorizedMiddleware(this: WebAppAuthProvider): ErrorRequestHandler;
export default unauthorizedMiddleware;
