import pocketbase from "pocketbase";
import type { DashUser } from "$lib/auth/dash.d";
import { POCKETBASE_SERVER, POCKETBASE_USER, POCKETBASE_PASSWORD } from "$env/static/private";
import crypto from "node:crypto";
import { encrypt, decrypt } from "./encryption";

// nodejs hack support for eventsource package
import EventSource from "eventsource";
globalThis.EventSource = EventSource;

let pb: pocketbase;
const DASH_CACHE = new Map<string, DashUser>();
const CACHE_TIMEOUT = 60 * 60 * 1000;

function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function decryptTotpSecret(dash_id: string, password: string, totp_encrypted: string): Promise<string> {
    try {
        const dash_account = await getDashUser(dash_id);
        const key = Buffer.from(crypto.createHash("sha1").update(`${dash_id + password + dash_account.salt}`).digest("hex")).subarray(0, 32);
        const decrypted = decrypt(key, Buffer.from(totp_encrypted, "hex"));

        return decrypted.toString("utf-8");
    } catch {
        return undefined;
    }
}

async function encryptTotpSecret(dash_id: string, password: string, totp_secret: string): Promise<string> {
    try {
        const dash_account = await getDashUser(dash_id);
        const key = Buffer.from(crypto.createHash("sha1").update(`${dash_id + password + dash_account.salt}`).digest("hex")).subarray(0, 32);
        const encrypted = encrypt(key, Buffer.from(totp_secret, "utf-8"));

        return encrypted.toString("hex");
    } catch {
        return undefined;
    }
}

async function calculatePasswordHash(dash_id: string, password: string): Promise<string> {
    try {
        const dash_account = await getDashUser(dash_id);
        return crypto.createHash("sha256").update(dash_id + password + dash_account.salt).digest("hex");
    } catch {
        return undefined;
    }
}

function generateRandomSalt(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

async function initDb() {
    pb = new pocketbase(POCKETBASE_SERVER);
    pb.autoCancellation(false);
    pb.collection("users").authWithPassword(POCKETBASE_USER, POCKETBASE_PASSWORD).then(() => {
        setInterval(() => {
            pb.collection("users").authRefresh().then(() => { }).catch(() => { });
        }, 60 * 60 * 1000);
    }).catch(() => {
        setTimeout(initDb, 5000);
    });

    while (!pb.authStore.isValid) {
        await sleep(1000);
        continue;
    }

    pb.collection("orange_bot_dash").subscribe("*", (data) => {
        DASH_CACHE.delete(data.record.id);
    });
}

async function getDashUser(id: string, retry: boolean = false): Promise<DashUser> {
    if (!pb)
        await initDb();
    try {
        if (DASH_CACHE.has(id)) {
            const cachedUser = DASH_CACHE.get(id);
            if (cachedUser !== undefined) {
                return cachedUser;
            }
        }

        const dash_user = await pb.collection("orange_bot_dash").getOne<DashUser>(id);
        DASH_CACHE.set(id, dash_user);
        setTimeout(() => DASH_CACHE.delete(id), CACHE_TIMEOUT);
        return dash_user;
    } catch (e) {
        if (retry) 
            return undefined;     
        else
            return await getDashUser(id, true);
    }
}
async function getDashUserOauth2(oauth2_id: string, retry: boolean = false): Promise<DashUser> {
    if (!pb)
        await initDb();
    oauth2_id = oauth2_id.replace(/\D/g, "");
    try {
        const dash_user = await pb.collection("orange_bot_dash").getFirstListItem<DashUser>(`oauth2_id = "${oauth2_id}"`);
        if (!DASH_CACHE.has(dash_user.id))
            DASH_CACHE.set(dash_user.id, dash_user);
        setTimeout(() => DASH_CACHE.delete(dash_user.id), CACHE_TIMEOUT);
        return dash_user;
    } catch {
        if (retry)
            return undefined;
        else
            return await getDashUserOauth2(oauth2_id, true);
    }
}
async function getDashUserUsername(username: string, retry: boolean = false): Promise<DashUser> {
    if (!pb)
        await initDb();
    try {
        const dash_user = await pb.collection("orange_bot_dash").getFirstListItem<DashUser>(`username = "${username}"`);
        if (!DASH_CACHE.has(dash_user.id))
            DASH_CACHE.set(dash_user.id, dash_user);
        setTimeout(() => DASH_CACHE.delete(dash_user.id), CACHE_TIMEOUT);
        return dash_user;
    } catch {
        if (retry)
            return undefined;
        else
            return await getDashUserUsername(username, true);
    }
}

async function createDashUser(user: DashUser): Promise<DashUser> {
    if (!pb)
        await initDb();
    user.salt = generateRandomSalt(64);
    return await pb.collection("orange_bot_dash").create<DashUser>(user);
}
async function removeDashUser(id: string) {
    if (!pb)
        await initDb();
    return await pb.collection("orange_bot_dash").delete(id);
}
async function updateDashUser(id: string, new_data: Partial<DashUser>) {
    if (!pb)
        await initDb();
    return await pb.collection("orange_bot_dash").update<DashUser>(id, new_data);
}

export { initDb, getDashUser, getDashUserOauth2, getDashUserUsername, createDashUser, removeDashUser, updateDashUser, pb, encryptTotpSecret, decryptTotpSecret, calculatePasswordHash };