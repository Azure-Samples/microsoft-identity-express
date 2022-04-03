/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


import * as crypto from "crypto";
import atob from 'atob';


export class CryptoUtils {

    algorithm: string;

    constructor(algorithm: string = "aes-192-cbc") {
        this.algorithm = algorithm;
    }

    generateSalt(): string {
        return crypto.randomBytes(20).toString('hex');
    }

    createKey(password, salt): Buffer {
        return crypto.scryptSync(password, salt, 24);
    }

    encryptData(stringifiedData, key): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encryptedData = cipher.update(stringifiedData, 'utf8', 'hex');

        return [iv.toString("hex"), encryptedData + cipher.final('hex')].join(".");
    }

    decryptData(encryptedData, key): string {
        const [iv, encrypted] = encryptedData.split(".");
        const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(iv, "hex"));
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    }

    decodeAuthToken(authToken: string): any {
        let obj = {};
        let base64Url = authToken.split('.')[1];
        let base64  =  base64Url.replace(/-/g,'+').replace(/_/, '/')
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''));
        let jsonParse = JSON.parse(jsonPayload);
        obj["payload"] = jsonParse;
        return obj; 
    }

}