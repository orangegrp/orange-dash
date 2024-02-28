import { json, type RequestEvent } from "@sveltejs/kit";

function verifyApiSession(request: RequestEvent) {
    const session_id_cookie = request.cookies.get("dash_session");
    const session_id_header = request.request.headers.get("X-Dash-SessionId");

    if (session_id_cookie !== session_id_header) {
        return undefined;
    }

    return session_id_cookie;
}

function success(data?: object, goto?: string) {
    return json({ success: true, goto: goto, ...data }, { status: 200 });
}
function redirect(goto: string, code: number = 303) {
    return json({ goto: goto }, { status: code });
}
function badRequest(reason: string, goto?: string) {
    return json({ success: false, goto: goto, reason: reason }, { status: 400 });
}
function unauthorized(reason: string, goto?: string) {
    return json({ success: false, goto: goto, reason: reason }, { status: 401 });
}
function forbidden(reason: string, goto?: string) {
    return json({ success: false, goto: goto, reason: reason }, { status: 403 });
}
function error(reason: string, goto?: string) {
    return json({ success: false, goto: goto, reason: reason }, { status: 500 });
}

export { success, redirect, badRequest, unauthorized, forbidden, error, verifyApiSession };