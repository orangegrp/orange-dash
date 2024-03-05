import { getDashUser } from "$lib/auth/dash_account.server";
import { getSession } from "$lib/auth/session.server";
import { badRequest, error, success, verifyApiSession } from "../apilib";
import { getGuildSettings, getUserSettings } from "./_backend/bot";

export async function GET(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    if (session) {
        const dash_user = await getDashUser(session.dash_id);
        const id = dash_user.oauth2_id ?? dash_user.role;

        const guild = request.request.headers.get("X-Guild-Snowflake");
        
        if (id && guild) {
            const data = await getGuildSettings(id, guild);
            if (data.success)
                return success(data);
            else
                return error(data.message);
        } else if (id) {
            const data = await getUserSettings(id);
            if (data.success)
                return success(data);
            else
                return error(data.message);
        } else {
            return badRequest("Bad request");
        }
    } else {
        return error("Session not found");
    }
}
