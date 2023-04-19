import { InteractionRequiredAuthError } from "@azure/msal-node";
/**
 * Token Validation library error class thrown for configuration errors
 */
export declare class InteractionRequiredError extends InteractionRequiredAuthError {
    scopes: Array<string>;
    constructor(errorCode: string, errorMessage?: string, subError?: string, scopes?: Array<string>, claims?: string);
}
