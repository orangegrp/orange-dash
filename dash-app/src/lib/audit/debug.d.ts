import type { DashUser } from "$lib/auth/dash";
import type { RecordModel } from "pocketbase";

type DashDebugEntry = Partial<RecordModel> & {
    error_id: string,
    dash_user?: DashUser,
    trace: string
};

export { DashDebugEntry };