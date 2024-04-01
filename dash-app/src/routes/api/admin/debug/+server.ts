import { getSession } from "$lib/auth/session.server";
import { error, success, verifyApiSession } from "../../apilib";
import { deleteDebugLogs, getDebugLogs } from "$lib/audit/debug_api.server";
import type { DashAuditEvent } from "$lib/audit/audit";
import { audit } from "$lib/audit/audit_api.server";
import { getDashUser } from "$lib/auth/dash_account.server";

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

export async function DELETE(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);
    
    try {
        if (session) {
            const user = await getDashUser(session.dash_id);
            
            if (user.role !== "Root")
                return error("Permission denied");

            const count = await deleteDebugLogs();

            audit("AuditAccess", session.dash_id, `User has purged ${count} debug entries.`, request);

            return success();
        } else {
            return error("Session not found");
        }
    } catch (e) {
        return error(e);
    }
}