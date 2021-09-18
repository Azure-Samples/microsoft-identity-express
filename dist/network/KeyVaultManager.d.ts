import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultCertificate } from "@azure/keyvault-certificates";
import { KeyVaultSecret } from "@azure/keyvault-secrets";
import { KeyVaultCredential, ClientCertificate } from "../config/AppSettings";
import { KeyVaultCredentialTypes } from "../utils/Constants";
export declare type KeyVaultCredentialResponse = {
    type: KeyVaultCredentialTypes.SECRET | KeyVaultCredentialTypes.CERTIFICATE;
    value: string & ClientCertificate;
};
export declare class KeyVaultManager {
    /**
     * Fetches credentials from Key Vault and updates appSettings
     * @param {AppSettings} appSettings
     * @returns {Promise}
     */
    getCredentialFromKeyVault(keyVaultCredential: KeyVaultCredential): Promise<KeyVaultCredentialResponse>;
    /**
     * Gets a certificate credential from Key Vault
     * @param {AppSettings} config
     * @param {DefaultAzureCredential} credential
     * @returns {Promise}
     */
    getCertificateCredential(keyVaultCredential: KeyVaultCredential, credential: DefaultAzureCredential): Promise<KeyVaultCertificate>;
    /**
     * Gets a secret credential from Key Vault
     * @param {AppSettings} config
     * @param {DefaultAzureCredential} credential
     * @returns {Promise}
     */
    getSecretCredential(keyVaultCredential: KeyVaultCredential, credential: DefaultAzureCredential): Promise<KeyVaultSecret>;
}
