import { audit } from '$lib/audit/audit_api.server';
import { calculatePasswordHash, decryptTotpSecret, encryptTotpSecret, getDashUser, updateDashUser } from '$lib/auth/dash_account.server.js';
import { getSession } from '$lib/auth/session.server';
import { generateTotpQrCodeUrl, generateTotpSecret, generateTotpUrl, getTotpSecret, newTotp, validateTotpToken } from '$lib/auth/totp.js';
import { badRequest, error, success, unauthorized, verifyApiSession } from '../../apilib';


export async function DELETE(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    const password = request.request.headers.get("X-Dash-Pw");

    if (!password) {
        return badRequest("Missing required headers");
    }

    if (session) {
        const user = await getDashUser(session.dash_id);
        if (await calculatePasswordHash(session.dash_id, password) !== user.password) {
            return unauthorized("Wrong password");
        }

        const login_methods = session.login_methods;
        updateDashUser(session.dash_id, { totp_secret: null, login_methods: [...new Set([...(login_methods.filter(m => m !== "TOTP"))])] });
        
        audit("SecurityInfoChange", session.dash_id, "Multi-factor authentication removed", request);
        
        return success();
    } else {
        return error("Session not found");
    }
}

export async function GET(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    const password = request.request.headers.get("X-Dash-Pw");

    if (!password) {
        return badRequest("Missing required headers");
    }

    if (session) {
        const user = await getDashUser(session.dash_id);
        if (await calculatePasswordHash(session.dash_id, password) !== user.password) {
            return unauthorized("Wrong password");
        }

        const totp_secret = user.totp_secret ? getTotpSecret(await decryptTotpSecret(session.dash_id, password, user.totp_secret)) : generateTotpSecret();
        const totp_engine = newTotp(totp_secret, session.dash_id);
        const totp_qrcode = await generateTotpQrCodeUrl(totp_engine);
        const totp_otpurl = generateTotpUrl(totp_engine);

        await audit("SecurityInfoChange", session.dash_id, "Multi-factor authenticatior secret shown", request);
        
        return success( { secret: totp_secret.base32, qr: totp_qrcode, algorithm: totp_engine.algorithm, url: totp_otpurl });
    } else {
        return error("Session not found");
    }
}

export async function POST(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    const password = request.request.headers.get("X-Dash-Pw");
    const { secret, code } = await request.request.json();

    if (!password) {
        return badRequest("Missing required headers");
    }

    if (session) {
        const user = await getDashUser(session.dash_id);
        if (await calculatePasswordHash(session.dash_id, password) !== user.password) {
            return unauthorized("Wrong password");
        }
        const totp_engine = newTotp(getTotpSecret(secret), session.dash_id);
        if (!validateTotpToken(totp_engine, code)) {
            return badRequest("Invalid code");
        }

        const login_methods = user.login_methods;
        const encrypted_secret = await encryptTotpSecret(session.dash_id, password, secret);

        await updateDashUser(session.dash_id, { totp_secret: encrypted_secret, login_methods: [...new Set([...login_methods, "TOTP"])] });

        await audit("SecurityInfoChange", session.dash_id, "Multi-factor authenticatior secret updated", request);
        
        return success();
    } else {
        return error("Session not found");
    }
}