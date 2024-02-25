import { CF_SECRET_KEY } from "$env/static/private";

async function validateCaptcha(cf_token: string, cf_ip: string): Promise<boolean> {
    try {
        const formData = new FormData();

        formData.append("secret", CF_SECRET_KEY);
        formData.append("response", cf_token);
        formData.append("remoteip", cf_ip);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        console.log(outcome);
        return outcome.success;
    } catch {
        return false;
    }
}

export { validateCaptcha };