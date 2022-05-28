/// <reference types="node" />
export declare class CryptoUtils {
    private algorithm;
    constructor(algorithm?: string);
    generateSalt(): string;
    createKey(password: string, salt: string): Buffer;
    encryptData(stringifiedData: string, key: Buffer): string;
    decryptData(encryptedData: string, key: Buffer): string;
}
