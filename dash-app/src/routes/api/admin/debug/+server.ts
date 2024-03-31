import { getSession } from "$lib/auth/session.server";
import { error, success, verifyApiSession } from "../../apilib";
import { getDebugLogs } from "$lib/audit/debug_api.server";
import type { DashAuditEvent } from "$lib/audit/audit";

export async function GET(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    try {
        if (session) {
            const page = request.request.headers.get("X-Dash-PageNr");
            const itemsPerPage = request.request.headers.get("X-Dash-IPP");
            const filterBy = (request.request.headers.get("X-Dash-Filter") ?? "*") as DashAuditEvent | "*";

            if (page && itemsPerPage) {
                return success({ data: await getDebugLogs(isNaN(Number(page)) ? 1 : Number(page), isNaN(Number(itemsPerPage)) ? 10 : Number(itemsPerPage), filterBy) });
            } else if (page) {
                return success({ data: await getDebugLogs(isNaN(Number(page)) ? 1 : Number(page), 10, filterBy)});
            } else if (itemsPerPage) {
                return success({ data: await getDebugLogs(1, isNaN(Number(itemsPerPage)) ? 10 : Number(itemsPerPage), filterBy)});
            } else {
                return success({ data: await getDebugLogs(1, 10, filterBy)});
            }
        } else {
            return error("Session not found");
        }
    } catch (e) {
        return error(e);
    }
}