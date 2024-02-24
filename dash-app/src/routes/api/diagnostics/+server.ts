import { json } from '@sveltejs/kit';

export async function GET(request) {

    const data = {
        requestId: crypto.randomUUID(),
        clientIp: request.getClientAddress(),
        clientPlatform: request.request.headers.get('sec-ch-ua-platform'),
        clientUa: request.request.headers.get('user-agent')
    };

    return json(data);
}