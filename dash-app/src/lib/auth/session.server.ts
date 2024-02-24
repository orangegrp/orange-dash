import type { DashSession } from "./dash";

const SESSION_MAP: Map<string, DashSession> = new Map();

function removeSession(session_id: string) {
    SESSION_MAP.delete(session_id);
}

function newSession(session_data: DashSession): string {
    const session_id = crypto.randomUUID();
    SESSION_MAP.set(session_id, session_data);

    setTimeout(() => removeSession(session_id), 7200000); // 2 hours
    return session_id;
}

function getSession(session_id: string) {
    return SESSION_MAP.get(session_id);
}

export { getSession, newSession, removeSession };