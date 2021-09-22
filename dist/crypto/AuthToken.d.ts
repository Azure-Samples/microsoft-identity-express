import { TokenClaims } from "@azure/msal-common";
export declare type AuthToken = {
    header: TokenHeader;
    payload: TokenClaims;
    signature: string;
};
export declare type TokenHeader = {
    kid: string;
    alg: string;
    typ: string;
    x5t?: string;
};
export declare type IdTokenClaims = TokenClaims & {
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
export declare type AccessTokenClaims = TokenClaims & {
    scp?: string;
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
