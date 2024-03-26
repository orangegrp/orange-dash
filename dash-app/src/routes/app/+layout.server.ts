import { redirect } from '@sveltejs/kit';
import { pb, initDb, getDashUser } from "$lib/auth/dash_account.server.js";
import { removeSession, getSessionKeysForId } from "$lib/auth/session.server.js";

// nodejs hack support for eventsource package
// import EventSource from "eventsource";

//globalThis.EventSource = EventSource;

async function terminateAllSessions(dash_id: string) {
    const allSessions = getSessionKeysForId(dash_id);
    allSessions.forEach((s) => removeSession(s));
}

function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

export const load = async (event) => {
    if (!pb)
        await initDb();

    const { session, session_id } = await event.parent();
    const dash_account = await getDashUser(session.dash_id);

    if (!dash_account || dash_account.locked) {
        console.log("Terminated", session, dash_account);
        await terminateAllSessions(session.dash_id);
        throw redirect(303, `/redirect?target=error${encodeURIComponent("?reason=7")}`);
    }

    return { session_id: session_id, dash_account: omit(dash_account, "collectionId", "collectionName", "created", "updated", "password", "salt", "totp_secret") };
}