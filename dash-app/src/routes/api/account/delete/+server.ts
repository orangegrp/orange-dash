import { removeDashUser } from '$lib/auth/dash_account.server.js';
import { getSession, getSessionKeysForId, removeSession } from '$lib/auth/session.server.js';
import { error, success, verifyApiSession } from "../../apilib";

export async function POST(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        getSessionKeysForId(session.dash_id).forEach(s => removeSession(s));
        removeDashUser(session.dash_id);
        return success(null, "/redirect?target=logout");
    } else {
        return error("Session not found");
    }
}