/// <reference types="node" />
export declare class CryptoUtils {
    algorithm: string;
    constructor(algorithm?: string);
    generateSalt(): string;
    createKey(password: any, salt: any): Buffer;
    encryptData(stringifiedData: any, key: any): string;
    decryptData(encryptedData: any, key: any): string;
}
