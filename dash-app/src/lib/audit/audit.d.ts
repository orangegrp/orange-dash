import type { DashUser } from "$lib/auth/dash";
import type { RecordModel } from "pocketbase";

type DashAuditEvent = "Activity" | "LoginOK" | "LoginFail" | "Logout" | "AuditAccess" | "SecurityInfoChange"  | "AccountCreation" | "AccountDeletion" | "Diagnostics";

type DashAuditEntry = Partial<RecordModel> & {
    event: DashAuditEvent
    dash_user?: DashUser,
    message?: string,
    ip_address?: string,
    location?: string,
    device?: string
}

export type { DashAuditEntry, DashAuditEvent};