import { audit } from "$lib/audit/audit_api.server";
import { debug } from "$lib/audit/debug_api.server";
import { getDashUser } from "$lib/auth/dash_account.server";
import { getSession } from "$lib/auth/session.server";
import { badRequest, error, success, verifyApiSession } from "../../apilib";
import { setGuildSettings, setUserSettings } from "../_backend/bot";

export async function POST(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        const dash_user = await getDashUser(session.dash_id);
        //const id = dash_user.oauth2_id ?? dash_user.role;
        const id = request.request.headers.get("X-User-Snowflake");

        if (id !== dash_user.id && dash_user.role !== "Admin" && dash_user.role !== "Root") {
            return error("Permission denied");
        }

        const data = await request.request.json();
        const old_value = request.request.headers.get("X-Old-Value");
        const guild = request.request.headers.get("X-Guild-Snowflake");

        if (id && guild) {
            const debug_id = crypto.randomUUID();
            audit("Diagnostics", dash_user.id, `Value for ${request.params.module} changed for user. See debug logs for details. ID: ${debug_id}`, request);
            debug(debug_id, dash_user.id, JSON.stringify({ delta: data, old_value: old_value }, null, 2));

            const result = await setGuildSettings(id, guild, request.params.module, data);
            if (result.success) {
                return success(result);
            } else {
                return error(result.message + JSON.stringify(result.data));
            }
        } else if (id) {
            const debug_id = crypto.randomUUID();
            audit("Diagnostics", dash_user.id, `Value for ${request.params.module} changed for user. See debug logs for details. ID: ${debug_id}`, request);
            debug(debug_id, dash_user.id, JSON.stringify({ delta: data, old_value: old_value }, null, 2));

            const result = await setUserSettings(id, request.params.module, data);
            if (result.success) {
                return success(result);
            } else {
                return error(result.message + JSON.stringify(result.data));
            }
        } else {
            return badRequest("Bad request");
        }
    } else {
        return error("Session not found");
    }
}
