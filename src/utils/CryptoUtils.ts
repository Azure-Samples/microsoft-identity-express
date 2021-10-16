import * as crypto from "crypto";

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
}