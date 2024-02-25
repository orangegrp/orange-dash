import { updateDashUser, calculatePasswordHash, getDashUser } from '$lib/auth/dash_account.server.js';
import { getSession, getSessionKeysForId, removeSession } from '$lib/auth/session.server.js';
import { json } from '@sveltejs/kit';

export async function POST(request) {
    const session_id = request.cookies.get("dash_session");
    const session = getSession(session_id);

    if (session) {
        const user = await getDashUser(session.dash_id);

        if (user.password) {
            return json({ success: false, goto: `"/redirect?target=error${encodeURIComponent("?reason=10")}"` });
        }

        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));
        
        const { password } = await request.request.json();
        const hashed = await calculatePasswordHash(session.dash_id, password);
        const login_methods = session.login_methods;
        
        updateDashUser(session.dash_id, { password: hashed, login_methods: [...new Set([...login_methods, "Password"])] });
    }

    return json({ success: true, goto: "/redirect?target=logout" });
}

export async function PUT(request) {
    const session_id = request.cookies.get("dash_session");
    const session = getSession(session_id);
    if (session) {
        const user = await getDashUser(session.dash_id);
        const { old_password, password } = await request.request.json();

        if (!old_password || !password) {
            return json({ success: false, goto: `/redirect?target=error${encodeURIComponent("?reason=0")}`  });
        }
        
        if (await calculatePasswordHash(session.dash_id, old_password) !== user.password) {
            return json({ success: false, goto: `/redirect?target=error${encodeURIComponent("?reason=10")}`  });
        }

        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));
        
        const hashed = await calculatePasswordHash(session.dash_id, password);
        const login_methods = session.login_methods;
        
        updateDashUser(session.dash_id, { password: hashed, totp_secret: null, login_methods: [...new Set([...(login_methods.filter(m => m !== "TOTP")), "Password"])] });
    }
    return json({ success: true, goto: "/redirect?target=logout" });
}