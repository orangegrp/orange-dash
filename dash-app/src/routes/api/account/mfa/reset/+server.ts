import { updateDashUser } from '$lib/auth/dash_account.server.js';
import { getSession } from '$lib/auth/session.server.js';
import { json } from '@sveltejs/kit';


export async function POST(request) {
    const session_id = request.cookies.get("dash_session");
    const session = getSession(session_id);
    if (session) {
        const login_methods = session.login_methods;
        updateDashUser(session.dash_id, { totp_secret: null, login_methods: [...new Set([...(login_methods.filter(m => m !== "TOTP"))])] });
        return json({ success: true } );
    } else {
        return json({ success: false, goto: "/redirect?target=error" + encodeURIComponent("?reason=0")}, { status: 401 });
    }
}