import type { DashSession } from "./dash";
import { pb }  from "../auth/dash_account.server";

const SESSION_MAP: Map<string, DashSession> = new Map();

function removeSession(session_id: string) {
    const session = getSession(session_id);
    if (session)
        pb.collection("orange_bot_dash").unsubscribe(session.dash_id);
    SESSION_MAP.delete(session_id);
}

function newSession(session_data: DashSession): string {
    const session_id = crypto.randomUUID();
    SESSION_MAP.set(session_id, session_data);

    setTimeout(() => removeSession(session_id), 604800000); // 7 days
    return session_id;
}

function getSession(session_id: string) {
    return SESSION_MAP.get(session_id);
}

function getSessionKeysForId(dash_id) {
    const keys = [];
    for (const [key, session] of SESSION_MAP) {
        if (session.dash_id === dash_id) {
            keys.push(key);
        }
    }
    return keys;
}

function getSessionsForId(dash_id: string) {
    return Array.from(SESSION_MAP.values()).filter(s => s.dash_id === dash_id);
}

export { getSession, newSession, removeSession, getSessionsForId, getSessionKeysForId };