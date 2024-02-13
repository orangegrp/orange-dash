const domain = "http://localhost:3000";
const apiUrls = {
    source: `${domain}/modules/news/api/v1/source`, // POST .../:gid        DELETE, GET, PUT   .../:gid/:id
    settings: `${domain}/modules/news/api/v1/settings`, // GET, PUT .../:gid    /       POST, DELETE .../:gid
};

import type { NewsConfig } from '$lib/news';

export { apiUrls };

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

async function getSettings(api_key: string) {
    return await ((await api_request(apiUrls.settings, "GET", api_key)).json());
}

async function setSettings(api_key: string, body: Omit<NewsConfig, "guilds">) {
    console.log(body);
    return await ((await api_request(apiUrls.settings, "PUT", api_key, body)).json());
}

export { getSettings, setSettings };