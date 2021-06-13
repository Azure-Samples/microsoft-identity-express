/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios, {AxiosResponse, AxiosRequestConfig} from "axios";
import { StringUtils } from "@azure/msal-common";
import { ErrorMessages } from "./Constants";

export class FetchManager {

    callApiEndpoint = async (endpoint: string, accessToken: string): Promise<AxiosResponse> => {

        if (StringUtils.isEmpty(accessToken)) {
            throw new Error(ErrorMessages.TOKEN_NOT_FOUND)
        }

        const options: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        
        console.log("request made to web API at: " + new Date().toString());
    
        try {
            const response: AxiosResponse = await axios.get(endpoint, options);
            return response;
        } catch(error) {
            console.log(error)
            return error;
        }
    }

}
