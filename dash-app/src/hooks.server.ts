import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle, type MaybePromise, type RequestEvent, type ResolveOptions, type HandleServerError, json } from "@sveltejs/kit";
import { getAccessTokenFromCode } from "$lib/auth/oauth2_discord.server";
import { getDashUserOauth2, createDashUser, getDashUser, getDashUserUsername, calculatePasswordHash, decryptTotpSecret } from "$lib/auth/dash_account.server";
import type { DashSession } from "$lib/auth/dash";
import { getSession, newSession, removeSession } from "$lib/auth/session.server";
import { validateCaptcha } from "$lib/captcha";
import { getTotpSecret, newTotp, validateTotpToken } from "$lib/auth/totp";
import { success } from "./routes/api/apilib";
import { generateQRCode } from "$lib";
import { NOTBOT_PROXY } from "$env/static/private";
import { audit } from "$lib/audit/audit_api.server";
import { debug } from "$lib/audit/debug_api.server";

type MiddlewareSequence = { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> };
const TOTP_MAP: Map<string, { dash_id: string, password: string }> = new Map();
const QR_MAP: Map<string, { dash_id?: string, ip: string }> = new Map();

async function totpAuthentication({ event }: MiddlewareSequence) {
    const body = await event.request.formData();

    const cf_token = body.get("cf-turnstile-response");
    const cf_ip = event.request.headers.get("CF-Connecting-IP");

    console.log(cf_token, cf_ip);

    if (!await validateCaptcha(cf_token as string, cf_ip as string)) {
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=5")}`);
    }

    const totp_session_id = event.cookies.get("dash_totp");

    if (!totp_session_id) {
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=4")}`);
    }

    const { dash_id, password } = TOTP_MAP.get(totp_session_id);
    const user = await getDashUser(dash_id);

    if (!user) {
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=1")}`);
    }

    if (user.locked) {
        audit("LoginFail", user.id, "Login attempt blocked because the account is locked", event);
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=6")}`);
    }

    if (!user.login_methods.includes("TOTP")) {
        audit("LoginFail", user.id, "TOTP authentication not available for this account", event);
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=8")}`);
    }

    const totp_0 = body.get("totp_0") as string;
    const totp_1 = body.get("totp_1") as string;
    const totp_2 = body.get("totp_2") as string;
    const totp_3 = body.get("totp_3") as string;
    const totp_4 = body.get("totp_4") as string;
    const totp_5 = body.get("totp_5") as string;

    if (!totp_0 || !totp_1 || !totp_2 || !totp_3 || !totp_4 || !totp_5) {

        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=2")}`);
    }

    const full_token = totp_0 + totp_1 + totp_2 + totp_3 + totp_4 + totp_5;
    const totp_value = await decryptTotpSecret(dash_id, password, user.totp_secret);

    console.log(totp_value);

    if (!totp_value) {
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=9")}`);
    }

    const secret = getTotpSecret(totp_value);

    console.log(secret);

    const totp = newTotp(secret, dash_id);

    if (!validateTotpToken(totp, full_token)) {
        TOTP_MAP.delete(totp_session_id);

        audit("LoginFail", user.id, "MFA authentication failed because invalid TOTP code was supplied", event);
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=2")}`);
    }

    TOTP_MAP.delete(totp_session_id);

    const session = {
        username: user.username,
        login_methods: user.login_methods,
        role: user.role,
        oauth2_id: user.oauth2_id,
        dash_id: user.id
    } as DashSession

    const session_id = newSession(session);
    const remember = body.get("remember");

    if (remember) {
        event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict", maxAge: 604800 });
    } else {
        event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict" });
    }

    audit("LoginOK", user.id, "Multi-factor authentication success", event);

    return redirect(302, "/redirect?target=app");
}

async function passwordAuthentication({ event }: MiddlewareSequence) {
    const body = await event.request.formData();

    const cf_token = body.get("cf-turnstile-response");
    const cf_ip = event.request.headers.get("CF-Connecting-IP");

    console.log(cf_token, cf_ip);

    if (!await validateCaptcha(cf_token as string, cf_ip as string)) {
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=5")}`);
    }

    const username = body.get("username");
    const password = body.get("password");
    const remember = body.get("remember");

    let user = await getDashUser(username as string);

    if (!user) {
        user = await getDashUserUsername(username as string);

        if (!user) {
            return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=1")}`);
        }
    }

    if (user.locked) {
        audit("LoginFail", user.id, "Login attempt blocked because the account is locked", event);
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=6")}`);
    }


    if (!user.login_methods.includes("Password")) {
        audit("LoginFail", user.id, "Password authentication not available for this account", event);
        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=8")}`);
    }

    const hashed = await calculatePasswordHash(user.id, password as string);


    if (hashed !== user.password) {
        audit("LoginFail", user.id, "Password authentication failed due to incorrect password", event);

        return redirect(303, `/redirect?target=error${encodeURIComponent("?reason=1")}`);
    }

    if (user.login_methods.includes("TOTP")) {
        const totp_session_id = crypto.randomUUID();
        TOTP_MAP.set(totp_session_id, { dash_id: user.id, password: password as string });
        setTimeout(() => TOTP_MAP.delete(totp_session_id), 300000); // 5 mins
        event.cookies.set("dash_totp", totp_session_id, { path: "/login/mfa", secure: false, httpOnly: true, sameSite: "strict", maxAge: 300 });
        
        audit("LoginOK", user.id, "Multi-factor authentication request", event);

        return redirect(302, `/redirect?target=${encodeURIComponent("login/mfa")}`);
        //return redirect(302, `/login/mfa`);
    }

    const session = {
        username: user.username,
        login_methods: user.login_methods,
        role: user.role,
        oauth2_id: user.oauth2_id,
        dash_id: user.id
    } as DashSession

    const session_id = newSession(session);

    if (remember) {
        event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict", maxAge: 604800 });
    } else {
        event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict" });
    }

    audit("LoginOK", user.id, "Password login success", event);

    return redirect(302, "/redirect?target=app");
}

async function discordAuthentication({ event }: MiddlewareSequence) {
    const code = event.url.searchParams.get("code");
    if (!code) {
        return redirect(303, "/error?reason=4");
    }

    const creds = await getAccessTokenFromCode(event.url.origin + "/login/oauth2/discord", code!);

    if (!creds) {
        return redirect(303, "/error?reason=4");
    }

    let user = await getDashUserOauth2(creds.oauth2_id);

    if (!user || user.oauth2_id === "") {
        user = {
            oauth2_id: creds.oauth2_id,
            locked: false,
            role: "OAuth2User",
            login_methods: [...new Set(["OAuth2"])],
        };

        user = await createDashUser(user);

        audit("AccountCreation", user.id, "New account created", event);
    }

    if (user.locked) {
        audit("LoginFail", user.id, "Login attempt blocked because the account is locked", event);
        return redirect(302, "/error?reason=6");
    }

    const session = {
        username: user.username,
        login_methods: user.login_methods,
        role: user.role,
        oauth2_id: creds.oauth2_id,
        dash_id: user.id,
        guilds: creds.guilds
    } as DashSession

    const session_id = newSession(session);
    event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict" });

    audit("LoginOK", user.id, "Logged in using Discord OAuth2", event);

    return redirect(302, "/redirect?target=app");
}

async function authentication({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname === "/login/oauth2/discord") {
        return await discordAuthentication({ event, resolve });
    } else if (event.url.pathname === "/login/qrcode" && event.request.method === "GET") {
        const qr_login_session = crypto.randomUUID();
        QR_MAP.set(qr_login_session, { ip: event.getClientAddress() });
        return success({ qrcode: await generateQRCode(qr_login_session) });
    } else if (event.url.pathname === "/login/password" && event.request.method === "POST") {
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