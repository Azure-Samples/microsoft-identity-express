import { RequestHandler } from "express";
export declare class AppServiceAuth {
    static isAppServiceAuthEnabled(): boolean;
    static getEffectiveScopesFromLoginParams(): string[];
    static getLoginUri(postLoginRedirectUri: any): string;
    static getLogoutUri(postLogoutRedirectUri: any): string;
    handleAppServiceAuth(appSettings: any): RequestHandler;
}
