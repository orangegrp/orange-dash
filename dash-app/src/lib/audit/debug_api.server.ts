import { DASH_KEY, DEBUG_TABLE } from "$env/static/private";
import type { DashUser } from "$lib/auth/dash";
import { initDb, pb } from "$lib/backend";
import { decrypt_str, encrypt_str } from "$lib/encryption";
import Convert from "ansi-to-html";
const convert = new Convert();
import type { DashDebugEntry } from "./debug";
import util from "util";

async function getDebugLogsRaw(page: number = 1, itemsPerPage: number = 50, filterBy: string | "*" = "*") {
    if (!pb)
        await initDb();

    return await pb.collection(DEBUG_TABLE).getList<DashDebugEntry>(page, itemsPerPage, {
        filter: `${filterBy === "*" ? "" : `error_id = "${filterBy.replaceAll('"', '\\"')}"`}`,
        sort: "-created"
    });
}

async function getDebugLogs(page: number = 1, itemsPerPage: number = 10, filterBy: string | "*" = "*") {
    const logs = await getDebugLogsRaw(page, itemsPerPage, filterBy);
    const decrypted_logs = logs.items.map(item => {
        item.trace = decrypt_str(item.trace, DASH_KEY);
        return item;
    });
    return decrypted_logs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function debug(error_id: string, dash_user: DashUser["id"] | undefined, error: any) {
    if (!pb)
        await initDb();

    const entry = {
        error_id: error_id,
        trace: encrypt_str(convert.toHtml(util.inspect(error, { showHidden: false, depth: null, colors: true })), DASH_KEY),
        dash_user: dash_user
    };

    await pb.collection(DEBUG_TABLE).create<DashDebugEntry>(entry);
}

export { getDebugLogs, getDebugLogsRaw, debug };