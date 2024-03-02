import type { DashSession } from '$lib/auth/dash';
import { getSession } from '$lib/auth/session.server';
import type { LayoutServerLoad, RequestEvent } from './$types';

type Locals = RequestEvent["locals"];
interface DashLocals extends Locals {
    session?: DashSession;
}

export const load: LayoutServerLoad = async (event) => {
    const dash_session_id = event.cookies.get("dash_session");
    const dash_session = getSession(dash_session_id) as DashLocals["session"];
    return {
        session: dash_session,
        session_id: dash_session_id
    };
};