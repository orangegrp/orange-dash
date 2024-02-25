import { removeDashUser } from '$lib/auth/dash_account.server.js';
import { getSession, getSessionKeysForId, removeSession } from '$lib/auth/session.server.js';
import { json } from '@sveltejs/kit';

export async function POST(request) {
    const session_id = request.cookies.get("dash_session");
    const session = getSession(session_id);
    if (session) {
        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));
        removeDashUser(session.dash_id);
    }
    return json({ success: true, goto: "/redirect?target=logout" });
}