import { RequestHandler } from "express";
export declare class AppServiceAuthHelper {
    constructor();
    static isAppServiceAuthEnabled(): boolean;
    static getEffectiveScopesFromLoginParams(): string[];
    static getLoginUri(postLoginRedirectUri: any): string;
    static getLogoutUri(postLogoutRedirectUri: any): string;
    handleAppServiceAuth(appSettings: any): RequestHandler;
}
