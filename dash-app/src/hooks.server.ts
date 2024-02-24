import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle, type MaybePromise, type RequestEvent, type ResolveOptions, type HandleServerError } from "@sveltejs/kit";
import { getAccessTokenFromCode } from "$lib/auth/oauth2_discord.server";
import { getDashUserOauth2, createDashUser } from "$lib/auth/dash_account.server";
import type { DashSession } from "$lib/auth/dash";
import { getSession, newSession } from "$lib/auth/session.server";

type MiddlewareSequence = { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> };

async function discordAuthentication({ event }: MiddlewareSequence) {
    const code = event.url.searchParams.get("code");
    if (!code) {
        console.warn("Missing code");
        return redirect(303, "/login/error?reason=4");
    }

    const creds = await getAccessTokenFromCode(event.url.origin + "/login/oauth2/discord", code!);

    if (!creds) {
        console.warn("OAuth2 error. No credentials");
        return redirect(303, "/login/error?reason=4");
    }

    let user = await getDashUserOauth2(creds.oauth2_id);

    if (!user || user.oauth2_id === "") {
        user = {
            oauth2_id: creds.oauth2_id,
            locked: false,
            role: "OAuth2User",
            login_methods: [...new Set(["OAuth2"])],
        };

        await createDashUser(user);
    }

    const session = {
        ...user,
        guilds: creds.guilds
    } as DashSession

    const session_id = newSession(session);
    event.cookies.set("dash_session", session_id, { path: "/", secure: false, httpOnly: true, sameSite: "strict" });
    event.setHeaders({
        "Refresh": "0; url=/login/redirect"
    });

    return redirect(302, "/login/redirect");
}

async function authentication({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname === "/login/oauth2/discord") {
        return await discordAuthentication({ event, resolve });
    } else if (event.url.pathname === "/login/password" && event.request.method === "POST") {
        return await resolve(event);
    } else if (event.url.pathname === "/login/mfa" && event.request.method === "POST") {
        return await resolve(event);
    }

    return await resolve(event);
}

function isValidSession(event: MiddlewareSequence["event"]) {
    const session_id = event.cookies.get("dash_session");
    return session_id && getSession(session_id);
}

async function authorization({ event, resolve }: MiddlewareSequence) {
    if (event.url.pathname.startsWith("/app") && !isValidSession(event)) {
        return redirect(303, "/login");
    } else if (event.url.pathname.startsWith("/login") && isValidSession(event)) {
        return redirect(303, "/app");
    } else if (event.url.pathname === "/api/diagnostics") {
        return await resolve(event);
    } else if (event.url.pathname.startsWith("/api") && !isValidSession(event)) {
        return new Response("Forbidden", { status: 403 });
    }

    return await resolve(event);
}

export const handle: Handle = sequence(authentication, authorization);

export const handleError: HandleServerError = ({ error, event, status, message }) => {
    const errorId = crypto.randomUUID();
    console.error(error, event, status, message);
    return {
        status: status,
        message: `${message} (${errorId})`,
    };
}