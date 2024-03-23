/* eslint-disable @typescript-eslint/no-explicit-any */
/*
    fastify.get("/user/:user/", async (request: FastifyRequest<{ Params: { user: string } }>, reply) => {
        reply.send(await getUserSettings(configApi, request.params.user));
    });
    fastify.post("/user/:user/:module/", async (request: FastifyRequest<{ Params: { user: string, module: string }, Body: any }>, reply) => {
        reply.send(await setUserSettings(configApi, request.params.module, request.params.user, request.body));
    });
    fastify.get('/user/:user/guilds/', async (request: FastifyRequest<{ Params: { user: string } }>, reply) => {
        reply.send(await getGuilds(configApi, request.params.user));
    });
    fastify.get('/user/:user/guild/:guild/', async (request: FastifyRequest<{ Params: { user: string, guild: string } }>, reply) => {
        reply.send(await getGuildSettings(configApi, request.params.user, request.params.guild));
    });
    fastify.post('/user/:user/guild/:guild/:module/', async (request: FastifyRequest<{ Params: { user: string, guild: string, module: string } }>, reply) => {
        reply.send(await setGuildSettings(configApi, request.params.module, request.params.guild, request.params.user, request.body));
    });
*/

import type { ValueEdits } from "./api_v1";

const base_url: string = "http://localhost:1234";

async function api_request(method: "GET" | "POST", ...args: string[]): Promise<Response> {
    const final_url = base_url + args.map(a => `/${a}`).join("") + "/";
    try {
        return await fetch(final_url, { method: method});
    } catch (e) {
        return {
            status: 500, json: async () => ({
                message: `Service unavailable. Error: ${e.message}`
            })
        } as Response;
    }
}
async function api_update(method: "GET" | "POST", data: any, ...args: string[]): Promise<Response> {
    const final_url = base_url + args.map(a => `/${a}`).join("") + "/";
    try {
        const result = await fetch(final_url, { method: method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
        const reply = await result.json();
        return reply.success === true ? { status: 200, json: async () => { return reply } } as Response: { status: 400, json: async () => ({
            message: "Invalid data",
            raw: JSON.stringify(reply)
        }) } as Response;
    } catch (e) {
        return {
            status: 500, json: async () => ({
                message: `Service unavailable. Error: ${e.message}`
            })
        } as Response;
    }
}

async function getUserSettings(user: string): Promise<{ success: boolean, message?: string, data: any }> {
    const user_settings = await api_request("GET", "user", user);
    if (user_settings.status === 200)
        return { success: true, data: await user_settings.json() }
    else {
        const data = await user_settings.json();
        return { success: false, message: data.message, data: data }
    }
}
async function setUserSettings(user: string, module: string, edits: ValueEdits): Promise<{ success: boolean, message?: string, data: any }> {
    const result = await api_update("POST", edits, "user", user, module);
    if (result.status === 200)
        return { success: true, data: await result.json() }
    else {
        const data = await result.json();
        console.log(data);
        return { success: false, message: data.message, data: data }
    }
}
async function getUserGuilds(user: string): Promise<{ success: boolean, message?: string, data: any }> {
    const user_guilds = await api_request("GET", "user", user, "guilds");
    if (user_guilds.status === 200)
        return { success: true, data: await user_guilds.json() }
    else {
        const data = await user_guilds.json();
        return { success: false, message: data.message, data: data }
    }
}
async function getGuildSettings(user: string, guild: string): Promise<{ success: boolean, message?: string, data: any }> {
    const guild_settings = await api_request("GET", "user", user, "guild", guild);
    if (guild_settings.status === 200)
        return { success: true, data: await guild_settings.json() }
    else {
        const data = await guild_settings.json();
        return { success: false, message: data.message, data: data }
    }
}

export { getUserSettings, getUserGuilds, getGuildSettings, setUserSettings };