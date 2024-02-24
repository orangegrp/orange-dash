import pocketbase from "pocketbase";
import type { DashUser } from "$lib/auth/dash.d";
import { POCKETBASE_SERVER, POCKETBASE_USER, POCKETBASE_PASSWORD } from "$env/static/private";

let pb: pocketbase;

function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function initDb() {
    pb = new pocketbase(POCKETBASE_SERVER);

    pb.collection('users').authWithPassword(POCKETBASE_USER, POCKETBASE_PASSWORD).then(() => {
        setInterval(() => {
            pb.collection('users').authRefresh().then(() => {}).catch(() => {});
        }, 60 * 60 * 1000);
    }).catch(() => {
        setTimeout(initDb, 5000);
    });

    while (!pb.authStore.isValid) {
        await sleep(1000);
        continue;
    }
}   

async function getDashUser(id: string): Promise<DashUser> {
    if (!pb)
        await initDb();
    return pb.collection("orange_bot_dash").getOne<DashUser>(id);
}
async function getDashUserOauth2(oauth2_id: string): Promise<DashUser> {
    if (!pb)
        await initDb();
    return pb.collection("orange_bot_dash").getFullList<DashUser>({ filter: `oauth2_id = '${encodeURIComponent(oauth2_id)}'`, perPage: 1, page: 1 })[0];
}
async function createDashUser(user: Omit<DashUser, "id" | "created" | "updated">): Promise<DashUser> {
    if (!pb)
        await initDb();
    return pb.collection("orange_bot_dash").create<Omit<DashUser, "id" | "created" | "updated">>(user);
}
async function updateDashUser(id: string, new_data: Partial<DashUser>) {
    if (!pb)
        await initDb();
    return pb.collection("orange_bot_dash").update<DashUser>(id, new_data);
} 

export { initDb, getDashUser, getDashUserOauth2, createDashUser, updateDashUser };