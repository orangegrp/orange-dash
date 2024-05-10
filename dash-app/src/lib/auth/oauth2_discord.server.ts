import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$env/static/private";

type DiscordUserCredentials = {
    oauth2_id: string,
    guilds: string[],
    token_type: string,
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
};

async function getDiscordUserInformation(token: string, type: string = "Bearer"): Promise<{ oauth2_id: string, guilds: string[] } | undefined> {
    try {
        const response = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                "Authorization": `${type} ${token}`
            }
        });

        const userData = await response.json();

        const response2 = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                "Authorization": `${type} ${token}`
            }
        });

        const guildData = await response2.json();

        return { oauth2_id: userData.id, guilds: guildData.map(g => g.id) } as { oauth2_id: string, guilds: string[] };
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function getAccessTokenFromCode(redirect_url: string, code: string): Promise<DiscordUserCredentials | undefined> {
    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirect_url,
        scope: "identify guilds"
    });

    console.log(redirect_url);

    try {
        const response = await fetch("https://discord.com/api/v10/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const response_data = await response.json() as Omit<DiscordUserCredentials, "oauth2_id" | "guilds">;
        const user_data = await getDiscordUserInformation(response_data.access_token, response_data.token_type);
        console.log(response_data);
        console.log(user_data);

        return { ...response_data, ...user_data } as DiscordUserCredentials;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { getAccessTokenFromCode };