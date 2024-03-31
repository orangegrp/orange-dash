import { AUDIT_TABLE, DASH_KEY } from "$env/static/private";
import type { DashUser } from "$lib/auth/dash";
import { initDb, pb } from "$lib/backend";
import { decrypt_str, encrypt_str } from "$lib/encryption";
import type { RequestEvent } from "@sveltejs/kit";
import type { DashAuditEntry, DashAuditEvent } from "./audit";
import { getIpInfo } from "./ipinfo.server";

async function getAuditLogsRaw(page: number = 1, itemsPerPage: number = 50, filterBy: DashAuditEvent | "*" = "*") {
    if (!pb)
        await initDb();

    return await pb.collection(AUDIT_TABLE).getList<DashAuditEntry>(page, itemsPerPage, {
        filter: `${filterBy === "*" ? "" : `event = "${filterBy.replaceAll('"', '\\"')}"`}`,
        sort: "-created"
    });
}

async function getAuditLogs(page: number = 1, itemsPerPage: number = 10, filterBy: DashAuditEvent | "*" = "*") {
    const logs = await getAuditLogsRaw(page, itemsPerPage, filterBy);
    const decrypted_logs = logs.items.map(item => {
        item.message = decrypt_str(item.message, DASH_KEY);
        item.ip_address = decrypt_str(item.ip_address, DASH_KEY);
        item.location = decrypt_str(item.location, DASH_KEY);
        item.device = decrypt_str(item.device, DASH_KEY);
        return item;
    });
    return decrypted_logs;
}

async function audit(event: DashAuditEvent, dash_user: DashUser["id"] | undefined, message: string, req_event: RequestEvent) {
    if (!pb)
        await initDb();

    const ip_address = req_event.request.headers.get("X-Forwarded-For") || req_event.getClientAddress();
    const deviceInfo = req_event.request.headers.get("User-Agent");
    
    const entry = {
        event: event,
        dash_user: dash_user,
        message: encrypt_str(message, DASH_KEY),
        ip_address: encrypt_str(ip_address, DASH_KEY),
        location: encrypt_str((await getIpInfo(ip_address)).location, DASH_KEY),
        device: encrypt_str(deviceInfo, DASH_KEY)
    };

    await pb.collection(AUDIT_TABLE).create<DashAuditEntry>(entry);
}

export { getAuditLogsRaw, getAuditLogs, audit };