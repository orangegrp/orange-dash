import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle, type HandleServerError, json, error } from "@sveltejs/kit";
import { getDashUser } from "$lib/auth/dash_account.server";
import type { DashSession } from "$lib/auth/dash";
import { getSession, newSession, removeSession } from "$lib/auth/session.server";
import { success } from "./routes/api/apilib";
import { generateQRCodeFixed } from "$lib";
import { NOTBOT_PROXY } from "$env/static/private";
import { audit } from "$lib/audit/audit_api.server";
import { debug } from "$lib/audit/debug_api.server";
import { discordAuthentication, passwordAuthentication, totpAuthentication } from "./middleware/authentication";
import type { MiddlewareSequence } from "./middleware/middleware";

const LOGIN_MAP: Map<string, { ip: string, qr_ids: string[], dash_id?: string }> = new Map();

async function authentication({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname === "/login/oauth2/discord") {
        return await discordAuthentication({ event, resolve });
    } else if (event.url.pathname === "/login/qrcode" && event.request.method === "GET") {
        const login_id = event.cookies.get("login_id");
        if (!login_id) {
            return error(400, "Login session expired");
        }
        const qr_login_session = crypto.randomUUID();
        const login_data = LOGIN_MAP.get(login_id);
        login_data.qr_ids.push(qr_login_session);
        if (login_data.qr_ids.length > 5) {
            login_data.qr_ids.splice(0, 1);
        }
        LOGIN_MAP.set(login_id, login_data);
        if (login_data.dash_id) {
            const user = await getDashUser(login_data.dash_id);
            const session = {
                username: user.username,
                login_methods: user.login_methods,
                role: user.role,
                oauth2_id: user.oauth2_id,
                dash_id: user.id
            } as DashSession
        
            const session_id = newSession(session);
            console.log("session id", session_id);
            event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict" });
        
            audit("LoginOK", session.dash_id, "Log in success using QR code", event);

            return new Response(JSON.stringify({ qrcode: "", goto: "/redirect?target=app"}), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": `dash_session=${session_id}; Path=/; Secure; HttpOnly; SameSite=strict`,
                }
            });
            //return success({ qrcode: "", goto: "/redirect?target=app"});
        }
        return success({ qrcode: await generateQRCodeFixed(`${login_id},${qr_login_session}`, 8) });
    } else if (event.url.pathname === "/login/qrcode" && event.request.method === "POST") {
        const session_id = event.cookies.get("dash_session");
        const session = getSession(session_id!) as DashSession;
        if (session && session.dash_id) {
            const qr_id = event.request.headers.get("X-Dash-QrCode");
            const login_id = event.request.headers.get("X-Dash-LoginId");
            const login_data = LOGIN_MAP.get(login_id!);
            if (login_data && login_data.qr_ids.includes(qr_id!)) {
                login_data.dash_id = session.dash_id;
                LOGIN_MAP.set(login_id!, login_data);
                return success();
            } else {
                return error(400, "Invalid QR code");
            }
        } 
        return error(401, "Unauthorized");
    } 
    else if (event.url.pathname === "/login/password" && event.request.method === "POST") {
        return await passwordAuthentication({ event, resolve });
    } else if (event.url.pathname === "/login/mfa" && event.request.method === "POST") {
        return await totpAuthentication({ event, resolve });
    } else if (event.url.pathname === "/logout") {
        const session_id = event.cookies.get("dash_session");
        const session = getSession(session_id!) as DashSession;
        if (session && session.dash_id) {
            audit("Logout", session.dash_id, "Log out success", event);
        }
        removeSession(session_id!);
        event.cookies.delete("dash_totp", { path: "/login/mfa", secure: false, httpOnly: true, sameSite: "strict", maxAge: 300 });
        event.cookies.delete("dash_session", { path: "/", secure: false, httpOnly: true, sameSite: "strict" });

        return redirect(302, "/redirect?target=login");
    } else if (event.url.pathname === "/login") {
        const login_id = crypto.randomUUID();
        LOGIN_MAP.set(login_id, { ip: event.getClientAddress(), qr_ids: [], dash_id: undefined });
        event.cookies.set("login_id", login_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict", maxAge: 300 });
    }

    return await resolve(event);
}

function isValidSession(event: MiddlewareSequence["event"]) {
    const session_id = event.cookies.get("dash_session");
    return session_id && getSession(session_id);
}

async function isValidAdminSession(event: MiddlewareSequence["event"]): Promise<boolean> {
    const session_id = event.cookies.get("dash_session");

    if (!session_id) {
        return false;
    }

    const session = getSession(session_id) as DashSession;

    if (!session) {
        return false;
    }

    const dash_account = await getDashUser(session.dash_id);

    if (!dash_account || dash_account.locked) {
        return false;
    }

    return dash_account.role === "Admin" || dash_account.role === "Root";
}

async function authorization({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname.startsWith("/app") && !isValidSession(event)) {
        return redirect(303, "/login");
    } else if (event.url.pathname.startsWith("/login") && isValidSession(event)) {
        return redirect(303, "/app");
    } else if (event.url.pathname === "/login/mfa" && !event.cookies.get("dash_totp")) {
        return redirect(303, "/login");
    } else if (event.url.pathname === "/api/diagnostics") {
        return await resolve(event);
    } else if (event.url.pathname.startsWith("/api/admin") && !isValidAdminSession(event)) {
        return json({ success: false, reason: "Invalid session" }, { status: 403 });
    } else if (event.url.pathname.startsWith("/api") && !isValidSession(event)) {
        return json({ success: false, reason: "Invalid session" }, { status: 403 });
    }

    return await resolve(event);
}

async function defaultroute({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname === "/") {
        return redirect(303, "/app");
    }
    return await resolve(event);
}

async function notbotproxy({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname.startsWith("/notbot-proxy")) {
        if (!await isValidAdminSession(event)) {
            console.log(event.cookies.getAll());
            return json({ success: false, reason: "Unauthorized" }, { status: 403 });
        }

        const urlPath = `${NOTBOT_PROXY}${event.url.pathname.replace("/notbot-proxy", "")}${event.url.search}`;
        const proxyUri = new URL(urlPath);

        event.request.headers.delete("connection");

        const result = await fetch(proxyUri.toString(), {
            method: event.request.method,
            body: event.request.body ? await event.request.text() : undefined,
            headers: event.request.headers
        }).catch((e) => { console.log(e); return json({ success: false, reason: `Request failed to be relayed.` }, { status: 500 }) });

        return result;
    }

    return await resolve(event);
}

export const handle: Handle = sequence(authentication, authorization, notbotproxy, defaultroute);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError: HandleServerError = ({ error, event, status, message }) => {
    const errorId = crypto.randomUUID();
    const session_id = event.cookies.get("dash_session");
    const session = getSession(session_id!) as DashSession;

    console.error(errorId, event.request.headers.get("X-Forwarded-For"), event.getClientAddress(), status, message, error);

    if (status !== 404) {
        debug(errorId, session?.dash_id ?? undefined, error);
        audit("Diagnostics", session?.dash_id ?? undefined, `Error: ${errorId} Status: ${status} Message: ${message}`, event);
    }

    return {
        status: status,
        message: `${message} (${errorId})`
    };
}