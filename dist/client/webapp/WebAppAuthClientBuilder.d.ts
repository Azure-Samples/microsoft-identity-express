import { BaseAuthClientBuilder } from "../BaseAuthClientBuilder";
import { MsalWebAppAuthClient } from "./MsalWebAppAuthClient";
import { AppServiceWebAppAuthClient } from "./AppServiceWebAppAuthClient";
import { AppSettings } from "../../config/AppSettings";
export declare class WebAppAuthClientBuilder extends BaseAuthClientBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    build(): MsalWebAppAuthClient | AppServiceWebAppAuthClient;
    buildAsync(): Promise<MsalWebAppAuthClient | AppServiceWebAppAuthClient>;
}
