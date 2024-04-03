import { SERVICE_LOGS_TABLE } from "$env/static/private";
import { initDb, pb } from "$lib/backend";
import type { DashServiceLogEntry } from "./logs";

async function getServiceLogsRaw(page: number = 1, itemsPerPage: number = 100, filterBy: string | "*" = "*") {
    if (!pb)
        await initDb();

    return await pb.collection(SERVICE_LOGS_TABLE).getList<DashServiceLogEntry>(page, itemsPerPage, {
        filter: `${filterBy === "*" ? "" : `level = "${filterBy.replaceAll('"', '\\"')}"`}`,
        sort: "+created"
    });
}

export { getServiceLogsRaw as getServiceLogs };