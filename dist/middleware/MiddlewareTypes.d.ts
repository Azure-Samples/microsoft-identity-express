import { AccountInfo, AuthenticationResult, AuthorizationCodeRequest } from "@azure/msal-node";
import { AuthContext } from "./context/AuthContext";
export declare type Request = {
    authContext: AuthContext;
    session: Session;
    originalUrl: string;
    protocol: string;
    hostname: string;
    method: string;
    body?: {
        [key: string]: string | number | undefined | unknown;
    };
    get: (key: string) => string;
};
export declare type Response = object & {
    status: (code: number) => Response;
    send: (message: string) => void;
    sendStatus: (code: number) => void;
    redirect: (url: string) => void;
};
export declare type NextFunction = (err?: unknown) => void;
export declare type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
export declare type RequestContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};
export declare type ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => void;
export declare type Session = {
    account: AccountInfo;
    tokenCache: string;
    isAuthenticated: boolean;
    protectedResources: Record<string, AuthenticationResult>;
    tokenRequestParams: AuthorizationCodeRequest;
    destroy: (callback: () => void) => void;
};
