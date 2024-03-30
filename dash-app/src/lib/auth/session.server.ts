import type { DashSession } from "./dash";
import { pb }  from "../auth/dash_account.server";
import { USERS_TABLE } from "$env/static/private";

const SESSION_MAP: Map<string, DashSession> = new Map();

import eventsource from 'eventsource';
global.EventSource = eventsource;

function removeSession(session_id: string) {
    const session = getSession(session_id);
    if (session)
        pb.collection(USERS_TABLE).unsubscribe(session.dash_id);
    SESSION_MAP.delete(session_id);
}

function newSession(session_data: DashSession): string {
    const session_id = crypto.randomUUID();
    SESSION_MAP.set(session_id, session_data);

    setTimeout(() => removeSession(session_id), 604800000); // 7 days
    return session_id;
}

function getSession(session_id: string) {
    if (session_id === undefined)
        return undefined;
    
    return SESSION_MAP.get(session_id);
}

function getSessionKeysForId(dash_id: string) {
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