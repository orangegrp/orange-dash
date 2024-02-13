

function api_request(url: string, method: string, api_key: string, body?: any) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": api_key,
        },
        body: body ? JSON.stringify(body) : null,
    });
}


export { api_request };