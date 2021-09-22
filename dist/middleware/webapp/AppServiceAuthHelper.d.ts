import { RequestHandler } from "express";
export declare class AppServiceAuthHelper {
    constructor();
    static isAppServiceAuthEnabled(): boolean;
    static getEffectiveScopes(scopesList: string[]): string[];
    static getLoginUri(postLoginRedirectUri: any): string;
    static getLogoutUri(postLogoutRedirectUri: any): string;
    handleAppServiceAuth(appSettings: any): RequestHandler;
}
