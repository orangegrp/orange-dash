/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
// thanks https://stackoverflow.com/users/897225/vanvasquez
/*
import crypto from "crypto";
const ALGORITHM = "aes-256-gcm"

const encrypt = (keyBuffer, dataBuffer, aadBuffer) => {
    // iv stands for "initialization vector"
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    const encryptedBuffer = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    let bufferLength = Buffer.alloc(1);
    bufferLength.writeUInt8(iv.length, 0);
    return Buffer.concat([bufferLength, iv, authTag, encryptedBuffer]);
}

const decrypt = (keyBuffer, dataBuffer, aadBuffer) => {
    const ivSize = dataBuffer.readUInt8(0);
    const iv = dataBuffer.slice(1, ivSize + 1);
    // The authTag is by default 16 bytes in AES-GCM
    const authTag = dataBuffer.slice(ivSize + 1, ivSize + 17);
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(dataBuffer.slice(ivSize + 17)), decipher.final()]);
}
*/


import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";

function encrypt (keyBuffer: Buffer, dataBuffer: Buffer): Buffer {
    const iv: Buffer = crypto.randomBytes(12);
    const cipher: crypto.CipherGCM = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    const encryptedBuffer: Buffer = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const authTag: Buffer = cipher.getAuthTag();
    const bufferLength: Buffer = Buffer.alloc(1);
    bufferLength.writeUInt8(iv.length, 0);
    return Buffer.concat([bufferLength, iv, authTag, encryptedBuffer]);
}

function decrypt (keyBuffer: Buffer, dataBuffer: Buffer): Buffer {
    const ivSize: number = dataBuffer.readUInt8(0);
    const iv: Buffer = dataBuffer.subarray(1, ivSize + 1);
    const authTag: Buffer = dataBuffer.subarray(ivSize + 1, ivSize + 17);
    const decipher: crypto.DecipherGCM = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(dataBuffer.subarray(ivSize + 17)), decipher.final()]);
}


export { encrypt, decrypt };