import type { NewsConfig, NewsGuildConfig, NewsSource } from "$lib/news";
import { api_request } from "../../dashapi";
const domain = "http://localhost:3000";

const apiUrls = {
    source: `${domain}/modules/news/api/v1/source`, // POST .../:gid        DELETE, GET, PUT   .../:gid/:id
    settings: `${domain}/modules/news/api/v1/settings`, // GET, PUT .../:gid    /       POST, DELETE .../:gid
};

async function getSettings(api_key: string) {
    return await ((await api_request(apiUrls.settings, "GET", api_key)).json());
}

async function getGuildSettings(api_key: string, guild_id: string): Promise<NewsGuildConfig> {
    return await (await (await api_request(apiUrls.settings + "/" + guild_id, "GET", api_key)).json()).data as NewsGuildConfig;
}

async function getSource(api_key: string, guild_id: string, id: string): Promise<NewsSource> {
    return await (await (await api_request(apiUrls.source + "/" + guild_id + "/" + id, "GET", api_key)).json()).data as NewsSource;
}

async function updateSource(api_key: string, guild_id: string, id: string, body: Partial<NewsSource>) {
    return await ((await api_request(apiUrls.source + "/" + guild_id + "/" + id, "PUT", api_key, body)).json());
}

async function addSource(api_key: string, guild_id: string, body: Partial<NewsSource>) {
    return await ((await api_request(apiUrls.source + "/" + guild_id, "POST", api_key, body)).json());
}

async function removeSource(api_key: string, guild_id: string, id: string) {
    return await ((await api_request(apiUrls.source + "/" + guild_id + "/" + id, "DELETE", api_key)).json());
}

async function setGuildSettings(api_key: string, guild_id: string, body: Partial<NewsGuildConfig>) {
    return await ((await api_request(apiUrls.settings + "/" + guild_id, "PUT", api_key, body)).json());
}

async function setSettings(api_key: string, body: Omit<NewsConfig, "guilds">) {
    console.log(body);
    return await ((await api_request(apiUrls.settings, "PUT", api_key, body)).json());
}

export { getSettings, setSettings, getGuildSettings, setGuildSettings, getSource, updateSource, addSource, removeSource };