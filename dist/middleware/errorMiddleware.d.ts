import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { ErrorRequestHandler } from "./MiddlewareTypes";
declare function errorMiddleware(this: WebAppAuthProvider): ErrorRequestHandler;
export default errorMiddleware;
