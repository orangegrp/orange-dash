import { getSession } from "$lib/auth/session.server";
import { error, success, verifyApiSession } from "../../apilib";
import { getAuditLogs } from "$lib/audit/audit_api.server";

export async function GET(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    try {
        if (session) {
            const page = request.request.headers.get("X-Dash-AuditPageNr");
            const itemsPerPage = request.request.headers.get("X-Dash-AuditIPP");

            //audit("AuditAccess", session.dash_id, "User hass accessed the audit logs", request.getClientAddress(), request.request.headers.get('user-agent'));

            if (page && itemsPerPage) {
                return success({ data: await getAuditLogs(isNaN(Number(page)) ? 1 : Number(page), isNaN(Number(itemsPerPage)) ? 10 : Number(itemsPerPage)) });
            } else if (page) {
                return success({ data: await getAuditLogs(isNaN(Number(page)) ? 1 : Number(page))});
            } else if (itemsPerPage) {
                return success({ data: await getAuditLogs(1, isNaN(Number(itemsPerPage)) ? 10 : Number(itemsPerPage))});
            } else {
                return success({ data: await getAuditLogs()});
            }
        } else {
            return error("Session not found");
        }
    } catch (e) {
        return error(e);
    }
}