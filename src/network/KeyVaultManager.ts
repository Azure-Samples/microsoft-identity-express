/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DefaultAzureCredential } from "@azure/identity";
import { CertificateClient, KeyVaultCertificate } from "@azure/keyvault-certificates";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";

import { KeyVaultCredential, ClientCertificate } from "../config/AppSettings";
import { KeyVaultCredentialTypes } from "../utils/Constants";

export type KeyVaultCredentialResponse = {
    type: KeyVaultCredentialTypes.SECRET | KeyVaultCredentialTypes.CERTIFICATE,
    value: string & ClientCertificate
}

export class KeyVaultManager {

    /**
     * Fetches credentials from Key Vault and updates appSettings
     * @param {AppSettings} appSettings 
     * @returns {Promise}
     */
    async getCredentialFromKeyVault(keyVaultCredential: KeyVaultCredential): Promise<KeyVaultCredentialResponse> {

        const credential = new DefaultAzureCredential();

        switch (keyVaultCredential.credentialType) {
            case KeyVaultCredentialTypes.SECRET: {
                try {
                    const secretResponse = await this.getSecretCredential(keyVaultCredential, credential);

                    return {
                        type: KeyVaultCredentialTypes.SECRET,
                        value: secretResponse.value,
                    } as KeyVaultCredentialResponse;

                } catch (error) {
                    console.log(error);
                }
                break;
            }

            case KeyVaultCredentialTypes.CERTIFICATE: {
                try {
                    const certificateResponse = await this.getCertificateCredential(keyVaultCredential, credential);
                    const secretResponse = await this.getSecretCredential(keyVaultCredential, credential);

                    return {
                        type: KeyVaultCredentialTypes.CERTIFICATE,
                        value: {
                            thumbprint: certificateResponse.properties.x509Thumbprint.toString(),
                            privateKey: secretResponse.value.split('-----BEGIN CERTIFICATE-----\n')[0]
                        }
                    } as KeyVaultCredentialResponse;
                } catch (error) {
                    console.log(error);
                }
                break;
            }

            default:
                break;
        }
    };

    /**
     * Gets a certificate credential from Key Vault
     * @param {AppSettings} config 
     * @param {DefaultAzureCredential} credential 
     * @returns {Promise}
     */
    async getCertificateCredential(keyVaultCredential: KeyVaultCredential, credential: DefaultAzureCredential): Promise<KeyVaultCertificate> {

        // Initialize secretClient with credentials
        const secretClient = new CertificateClient(keyVaultCredential.keyVaultUrl, credential);

        try {
            const keyVaultCertificate = await secretClient.getCertificate(keyVaultCredential.credentialName);
            return keyVaultCertificate;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    /**
     * Gets a secret credential from Key Vault
     * @param {AppSettings} config 
     * @param {DefaultAzureCredential} credential 
     * @returns {Promise}
     */
    async getSecretCredential(keyVaultCredential: KeyVaultCredential, credential: DefaultAzureCredential): Promise<KeyVaultSecret> {

        // Initialize secretClient with credentials
        const secretClient = new SecretClient(keyVaultCredential.keyVaultUrl, credential);

        try {
            const keyVaultSecret = await secretClient.getSecret(keyVaultCredential.credentialName);
            return keyVaultSecret;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}