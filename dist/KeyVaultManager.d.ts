import { KeyVaultCertificate } from "@azure/keyvault-certificates";
import { ManagedIdentityCredential } from "@azure/identity";
import { KeyVaultSecret } from "@azure/keyvault-secrets";
import { AppSettings } from "./Types";
export declare class KeyVaultManager {
    getCredentialFromKeyVault(config: AppSettings): Promise<KeyVaultCertificate | KeyVaultSecret>;
    getCertificateCredential(config: AppSettings, credential: ManagedIdentityCredential): Promise<KeyVaultCertificate>;
    getSecretCredential(config: AppSettings, credential: ManagedIdentityCredential): Promise<KeyVaultSecret>;
}
