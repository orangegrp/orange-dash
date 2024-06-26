import * as OTPAuth from "otpauth";
import crypto from "node:crypto";
import { generateQRCode } from "$lib";

function generateTotpSecret() {
    return OTPAuth.Secret.fromHex(crypto.randomBytes(16).toString("hex"));
}

function getTotpSecret(secret: string) {
    return OTPAuth.Secret.fromBase32(secret);
}

function newTotp(secret: OTPAuth.Secret, dash_id: string) {
    return new OTPAuth.TOTP({
        issuer: "orange Dash",
        label: dash_id,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret
    });
}

function generateTotpToken(totp: OTPAuth.TOTP) {
    return OTPAuth.TOTP.generate(totp);
}

function validateTotpToken(totp: OTPAuth.TOTP, token: string) {
    return totp.validate({ token, window: 1 }) !== null;
}

function generateTotpUrl(totp: OTPAuth.TOTP) {
    return totp.toString();
}

async function generateTotpQrCodeUrl(totp: OTPAuth.TOTP) {
    const url = generateTotpUrl(totp);
    return generateQRCode(url);
}

export { generateTotpSecret, getTotpSecret, generateTotpToken, validateTotpToken,  generateTotpUrl, generateTotpQrCodeUrl, newTotp };