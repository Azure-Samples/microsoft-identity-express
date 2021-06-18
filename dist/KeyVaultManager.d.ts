import { KeyVaultCertificate } from "@azure/keyvault-certificates";
import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret } from "@azure/keyvault-secrets";
import { AppSettings } from "./Types";
export declare class KeyVaultManager {
    /**
     * Fetches credentials from Key Vault and updates appSettings
     * @param {AppSettings} config
     * @returns {Promise}
     */
    getCredentialFromKeyVault(config: AppSettings): Promise<AppSettings>;
    /**
     * Gets a certificate credential from Key Vault
     * @param {AppSettings} config
     * @param {DefaultAzureCredential} credential
     * @returns {Promise}
     */
    getCertificateCredential(config: AppSettings, credential: DefaultAzureCredential): Promise<KeyVaultCertificate>;
    /**
     * Gets a secret credential from Key Vault
     * @param {AppSettings} config
     * @param {DefaultAzureCredential} credential
     * @returns {Promise}
     */
    getSecretCredential(config: AppSettings, credential: DefaultAzureCredential): Promise<KeyVaultSecret>;
}
