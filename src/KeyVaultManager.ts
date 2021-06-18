import { CertificateClient, KeyVaultCertificate } from "@azure/keyvault-certificates";
import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";

import { AppSettings } from "./Types";
import { KeyVaultCredentialTypes } from "./Constants";

export class KeyVaultManager {

    /**
     * Fetches credentials from Key Vault and updates appSettings
     * @param {AppSettings} config 
     * @returns {Promise}
     */
    async getCredentialFromKeyVault(config: AppSettings): Promise<AppSettings> {

        const credential = new DefaultAzureCredential();

        if (!config.appCredentials.keyVaultCredential) {
            return config
        }

        switch (config.appCredentials.keyVaultCredential.credentialType) {
            case KeyVaultCredentialTypes.SECRET: {
                try {
                    const secretResponse = await this.getSecretCredential(config, credential);
                    config.appCredentials.clientSecret = secretResponse.value;
                    return config;
                } catch (error) {
                    console.log(error);
                }
                break;
            }

            case KeyVaultCredentialTypes.CERTIFICATE: {
                try {
                    const certificateResponse = await this.getCertificateCredential(config, credential);
                    const secretResponse = await this.getSecretCredential(config, credential);

                    config.appCredentials.clientCertificate = {
                        thumbprint: certificateResponse.properties.x509Thumbprint.toString(),
                        privateKey: secretResponse.value.split('-----BEGIN CERTIFICATE-----\n')[0]
                    }
                    return config;
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
    async getCertificateCredential(config: AppSettings, credential: DefaultAzureCredential): Promise<KeyVaultCertificate> {

        // Initialize secretClient with credentials
        const secretClient = new CertificateClient(config.appCredentials.keyVaultCredential.keyVaultUrl, credential);

        try {
            const keyVaultCertificate = await secretClient.getCertificate(config.appCredentials.keyVaultCredential.credentialName);
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
    async getSecretCredential(config: AppSettings, credential: DefaultAzureCredential): Promise<KeyVaultSecret> {

        // Initialize secretClient with credentials
        const secretClient = new SecretClient(config.appCredentials.keyVaultCredential.keyVaultUrl, credential);

        try {
            const keyVaultSecret = await secretClient.getSecret(config.appCredentials.keyVaultCredential.credentialName);
            return keyVaultSecret;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}