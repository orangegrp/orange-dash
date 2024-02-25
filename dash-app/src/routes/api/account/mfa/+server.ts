import { calculatePasswordHash, decryptTotpSecret, encryptTotpSecret, getDashUser, updateDashUser } from '$lib/auth/dash_account.server.js';
import { getSession } from '$lib/auth/session.server.js';
import { generateTotpQrCodeUrl, generateTotpSecret, generateTotpUrl, getTotpSecret, newTotp, validateTotpToken } from '$lib/auth/totp.js';
import { json } from '@sveltejs/kit';

export async function POST(request) {
    const session_id = request.cookies.get("dash_session");
    const session = getSession(session_id);

    if (session) {
        const user = await getDashUser(session.dash_id);

        const { password } = await request.request.json();

        if (!password || user.password !== await calculatePasswordHash(session.dash_id, password)) {
            return json({ success: false, goto: "/redirect?target=error" + encodeURIComponent("?reason=1") });
        }

        const secret = user.totp_secret ? getTotpSecret(await decryptTotpSecret(session.dash_id, password, user.totp_secret)) : generateTotpSecret();
        const totp = newTotp(secret, session.dash_id);
        const qrcode = await generateTotpQrCodeUrl(totp);
        const url = generateTotpUrl(totp);

        return json({ success: true, qrcode, url, secret: secret.base32 });
    }

    return json({ success: false, goto: "/redirect?target=error" + encodeURIComponent("?reason=1") }, { status: 401 });
}

export async function PUT(request) {
    const session_id = request.cookies.get("dash_session");
    const { password, secret, code } = await request.request.json();
    const session = getSession(session_id);
    
    console.log(password, secret, code);

    if (session && password) {
        const user = await getDashUser(session.dash_id);
        const totp = newTotp(getTotpSecret(secret), session.dash_id);

        if (validateTotpToken(totp, code)) {
            const login_methods = user.login_methods;
            const encrypted = await encryptTotpSecret(session.dash_id, password, secret);
            console.log(encrypted);
            await updateDashUser(session.dash_id, { totp_secret: encrypted, login_methods: [...new Set([...login_methods, "TOTP"])] });
        
            request.cookies.delete("totp_setup_password", { path: "/api/account/mfa", httpOnly: true, sameSite: "strict" , secure: false });
            return json({ success: true });
        }

        return json({ success: false, goto: "/redirect?target=error" + encodeURIComponent("?reason=2") }, { status: 401 });
    }

    return json({ success: false, goto: "/redirect?target=error" + encodeURIComponent("?reason=0") }, { status: 401 });
}