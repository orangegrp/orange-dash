import type { DashUser } from "$lib/auth/dash.d";
import { USERS_TABLE } from "$env/static/private";
import crypto from "node:crypto";
import { encrypt, decrypt } from "../encryption";
import { CACHE_TIMEOUT, DASH_CACHE, initDb, pb } from "$lib/backend";

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


async function getDashUser(id: string, retry: boolean = false): Promise<DashUser> {
    if (!pb || !pb.authStore.isValid)
        await initDb();
    try {
        if (DASH_CACHE.has(id)) {
            const cachedUser = DASH_CACHE.get(id);
            if (cachedUser !== undefined) {
                return cachedUser;
            }
        }

        const dash_user = await pb.collection(USERS_TABLE).getOne<DashUser>(id);
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
    if (!pb || !pb.authStore.isValid)
        await initDb();
    oauth2_id = oauth2_id.replace(/\D/g, "");
    try {
        const dash_user = await pb.collection(USERS_TABLE).getFirstListItem<DashUser>(`oauth2_id = "${oauth2_id}"`);
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
    if (!pb || !pb.authStore.isValid)
        await initDb();
    try {
        const dash_user = await pb.collection(USERS_TABLE).getFirstListItem<DashUser>(`username = "${username}"`);
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
    if (!pb || !pb.authStore.isValid)
        await initDb();
    user.salt = generateRandomSalt(64);
    return await pb.collection(USERS_TABLE).create<DashUser>(user);
}
async function removeDashUser(id: string) {
    try {
        if (!pb || !pb.authStore.isValid)
            await initDb();
        return await pb.collection(USERS_TABLE).delete(id);
    } finally {
        DASH_CACHE.delete(id);
    }
}
async function updateDashUser(id: string, new_data: Partial<DashUser>) {
    try {
        if (!pb || !pb.authStore.isValid)
            await initDb();
        return await pb.collection(USERS_TABLE).update<DashUser>(id, new_data);
    } finally {
        DASH_CACHE.delete(id);
    }
}

export { initDb, getDashUser, getDashUserOauth2, getDashUserUsername, createDashUser, removeDashUser, updateDashUser, pb, encryptTotpSecret, decryptTotpSecret, calculatePasswordHash };