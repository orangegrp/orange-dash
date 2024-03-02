import { success } from '../apilib.js';
export async function GET(request) {
    const data = {
        requestId: crypto.randomUUID(),
        clientIp: request.getClientAddress(),
        clientPlatform: request.request.headers.get('sec-ch-ua-platform'),
        clientUa: request.request.headers.get('user-agent')
    };

    console.log(`Diagnostics request: ${JSON.stringify(data)}`);

    return success(data);
}