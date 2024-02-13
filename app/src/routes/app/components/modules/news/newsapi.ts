import type { NewsConfig } from "$lib/news";
import { api_request } from "../../dashapi";
const domain = "http://localhost:3000";

const apiUrls = {
    source: `${domain}/modules/news/api/v1/source`, // POST .../:gid        DELETE, GET, PUT   .../:gid/:id
    settings: `${domain}/modules/news/api/v1/settings`, // GET, PUT .../:gid    /       POST, DELETE .../:gid
};

async function getSettings(api_key: string) {
    return await ((await api_request(apiUrls.settings, "GET", api_key)).json());
}

async function setSettings(api_key: string, body: Omit<NewsConfig, "guilds">) {
    console.log(body);
    return await ((await api_request(apiUrls.settings, "PUT", api_key, body)).json());
}

export { getSettings, setSettings }