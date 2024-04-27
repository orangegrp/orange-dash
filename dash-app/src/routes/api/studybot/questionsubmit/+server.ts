//import { audit } from "$lib/audit/audit_api.server";
import { getDashUser } from "$lib/auth/dash_account.server";
import { getSession } from "$lib/auth/session.server";
import { error, success, unauthorized, verifyApiSession } from "../../apilib";
import { pb } from "$lib/backend";
import { audit } from "$lib/audit/audit_api.server";
import { debug } from "$lib/audit/debug_api.server";

export async function POST(request) {
    const session_id = verifyApiSession(request);
    const session = getSession(session_id);

    const { category, question, icon, image, link, footer, choices, answer, content } = await request.request.json();

    if (session) {
        const user = await getDashUser(session.dash_id);

        if (!user.abac_str.includes("studybot")) {
            return unauthorized("Unauthorized");
        }
        try {
            const result = await pb.collection("x_studybot_questions").create({
                category: category,
                question: question,
                icon: icon,
                image: image,
                link: link,
                footer: footer,
                choices: choices.split(","),
                answer: answer.split(","),
                content: content
            });

            if (result.id) {
                audit("Activity", user.id, `[Studybot content manager] New question created by user. Record ID: ${result.id}`, request);
                return success({ id: result.id });
            }
        } catch (e) {
            const error_id = crypto.randomUUID();
            debug(error_id, user.id, e);
            audit("Diagnostics", user.id, `Failed to create new question ID: ${error_id} - Error: ${e.message}`, request);
            return error(e.message);
        }
    } else {
        return error("Session not found");
    }
}