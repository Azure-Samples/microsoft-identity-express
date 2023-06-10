import { InteractionRequiredAuthError } from "@azure/msal-node";
import { LoginOptions, TokenRequestOptions } from "../middleware/MiddlewareOptions";
/**
 * Token Validation library error class thrown for configuration errors
 */
export declare class InteractionRequiredError extends InteractionRequiredAuthError {
    requestOptions: LoginOptions;
    constructor(errorCode: string, errorMessage?: string, subError?: string, originalRequest?: TokenRequestOptions);
}
