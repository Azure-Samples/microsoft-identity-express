import { CertificateClient, KeyVaultCertificate } from "@azure/keyvault-certificates";
import { ManagedIdentityCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";

import { AppSettings } from "./Types";

export class KeyVaultManager {

    async getCredentialFromKeyVault(config: AppSettings): Promise<KeyVaultCertificate | KeyVaultSecret> {

        // Using VS Code's auth context for credentials
        const credential = new ManagedIdentityCredential();

        switch (config.appCredentials.keyVault.credentialType) {
            case "secret": {
                return await this.getSecretCredential(config, credential);
            }

            case "certificate": {
                return await this.getCertificateCredential(config, credential);
            }

            default:
                break;
        }
    };

    async getCertificateCredential(config: AppSettings, credential: ManagedIdentityCredential): Promise<KeyVaultCertificate> {

        // Initialize secretClient with credentials
        const secretClient = new CertificateClient(config.appCredentials.keyVault.keyVaultUrl, credential);

        try {
            const keyVaultCertificate = await secretClient.getCertificate(config.appCredentials.keyVault.credentialName);
            return keyVaultCertificate;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getSecretCredential(config: AppSettings, credential: ManagedIdentityCredential): Promise<KeyVaultSecret> {

        // Initialize secretClient with credentials
        const secretClient = new SecretClient(config.appCredentials.keyVault.keyVaultUrl, credential);

        try {
            const keyVaultSecret = await secretClient.getSecret(config.appCredentials.keyVault.credentialName);
            return keyVaultSecret;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}