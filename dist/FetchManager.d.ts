import { AxiosResponse } from "axios";
export declare class FetchManager {
    callApiEndpoint: (endpoint: string, accessToken: string) => Promise<AxiosResponse>;
}
