import { audit } from '$lib/audit/audit_api.server';
import { updateDashUser, calculatePasswordHash, getDashUser, decryptTotpSecret, encryptTotpSecret } from '$lib/auth/dash_account.server.js';
import { getSession, getSessionKeysForId, removeSession } from '$lib/auth/session.server.js';
import { badRequest, error, forbidden, success, verifyApiSession } from '../../apilib';

export async function GET(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        const user = await getDashUser(session.dash_id);
        const password = request.request.headers.get("X-Dash-Pw");

        if (await calculatePasswordHash(session.dash_id, password) !== user.password) {
            return forbidden("Incorrect password");
        }
        
        return success();
    } else {
        return error("Session not found");
    }
}

export async function POST(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        const user = await getDashUser(session.dash_id);

        if (user.password) {
            return error("Password already set");
        }

        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));

        const { password } = await request.request.json();
        const hashed = await calculatePasswordHash(session.dash_id, password);
        const login_methods = session.login_methods;

        updateDashUser(session.dash_id, { password: hashed, login_methods: [...new Set([...login_methods, "Password"])] });


        audit("SecurityInfoChange", session.dash_id, "Password login was setup for this account", request);
        
    
        return success(null, "/redirect?target=logout");
    } else {
        return error("Session not found");
    }
}

export async function PUT(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        const user = await getDashUser(session.dash_id);
        const old_password = request.request.headers.get("X-Dash-OldPw");
        const { password } = await request.request.json();

        if (!old_password) {
            return badRequest("Missing required headers");
        }
        if (!password) {
            return badRequest("Missing required fields");
        }
        if (await calculatePasswordHash(session.dash_id, old_password) !== user.password) {
            return forbidden("Incorrect password");
        }

        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));

        const hashed = await calculatePasswordHash(session.dash_id, password);

        if (user.login_methods.includes("TOTP") && user.totp_secret) {
            const totp_value = await decryptTotpSecret(session.dash_id, old_password, user.totp_secret);
            const new_encrypted = await encryptTotpSecret(session.dash_id, password, totp_value);
            await updateDashUser(session.dash_id, { password: hashed, totp_secret: new_encrypted, login_methods: [...new Set([...user.login_methods, "Password"])] });
        } else {
            await updateDashUser(session.dash_id, { password: hashed, totp_secret: null, login_methods: [...new Set([...(user.login_methods.filter(m => m !== "TOTP")), "Password"])] });
        }

        audit("SecurityInfoChange", session.dash_id, "Password changed", request);
        

        return success(null, "/redirect?target=logout");
    } else {
        return error("Session not found");
    }
}