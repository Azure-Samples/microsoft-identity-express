import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest, SilentFlowRequest } from '@azure/msal-node';
import { TokenClaims } from '@azure/msal-common';
import { Resource } from '../config/AppSettings';
import { AppStages } from './Constants';
declare module 'express-session' {
    interface SessionData {
        id: string;
        key: string;
        csrfToken: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authorizationUrlRequest: AuthorizationUrlRequest;
        authorizationCodeRequest: AuthorizationCodeRequest;
        silentFlowRequest: SilentFlowRequest;
        protectedResources?: Record<string, Resource>;
    }
}
declare module 'express' {
    interface Request {
        authInfo?: object;
        oboToken?: string;
        oboAssertion?: string;
    }
}
export declare type AppState = {
    appStage: AppStages;
    csrfToken: string;
    redirectTo: string;
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
    scp: string;
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
