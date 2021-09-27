import { BaseAuthClientBuilder } from "./BaseAuthClientBuilder";
import { MsalWebAppAuthMiddleware } from "../middleware/MsalWebAppAuthMiddleware";
import { AppServiceWebAppAuthMiddleware } from "../middleware/AppServiceWebAppAuthMiddleware";
import { AppSettings } from "../config/AppSettings";
export declare class WebAppAuthClientBuilder extends BaseAuthClientBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    build(): MsalWebAppAuthMiddleware | AppServiceWebAppAuthMiddleware;
    buildAsync(): Promise<MsalWebAppAuthMiddleware | AppServiceWebAppAuthMiddleware>;
}
