import type { DashSession } from '$lib/auth/dash';
import { getSession } from '$lib/auth/session.server';
import type { LayoutServerLoad, RequestEvent } from './$types';

type Locals = RequestEvent["locals"];
interface DashLocals extends Locals {
    session?: DashSession;
}

export const load: LayoutServerLoad = async (event) => {
    return {
        session: getSession(event.cookies.get("dash_session")) as DashLocals["session"],
    };
};