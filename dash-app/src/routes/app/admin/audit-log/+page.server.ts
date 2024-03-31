import { audit } from "$lib/audit/audit_api.server";

export const load = async (event) => {
    const { session_id, dash_account } = await event.parent();

    if (dash_account) {
        await audit("AuditAccess", dash_account.id, "Viewed audit logs", event);
    }

    return { session_id: session_id, dash_account: dash_account, audited: true };
}