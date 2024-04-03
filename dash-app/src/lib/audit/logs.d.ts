import type { RecordModel } from "pocketbase";

type DashServiceLogLevel = "Error" | "Warning" | "Log" | "Verbose";

type DashServiceLogEntry = Partial<RecordModel> & {
    level: DashServiceLogLevel,
    service_name: string,
    host: string,
    details: string
};

export { DashServiceLogEntry, DashServiceLogLevel };