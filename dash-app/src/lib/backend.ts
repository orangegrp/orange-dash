import pocketbase from "pocketbase";
import { POCKETBASE_SERVER, POCKETBASE_USER, POCKETBASE_PASSWORD, USERS_TABLE } from "$env/static/private";
import type { DashUser } from "./auth/dash";
import { sleep } from "./sleep";

// nodejs hack support for eventsource package
import eventsource from 'eventsource';
global.EventSource = eventsource;

let pb: pocketbase;

const DASH_CACHE = new Map<string, DashUser>();
const CACHE_TIMEOUT = 60 * 60 * 1000;

async function initDb() {
    if (pb && pb.authStore.isValid)
        return;
    
    pb = new pocketbase(POCKETBASE_SERVER);
    pb.autoCancellation(false);
    pb.collection("users").authWithPassword(POCKETBASE_USER, POCKETBASE_PASSWORD).then(() => {
        setInterval(() => {
            pb.collection("users").authRefresh().then(() => { }).catch(() => { });
        }, 60 * 60 * 1000);
    }).catch(() => {
        setTimeout(initDb, 5000);
    });

    while (!pb || !pb.authStore.isValid) {
        await sleep(1000);
        continue;
    }

    pb.collection(USERS_TABLE).subscribe("*", (data) => {
        DASH_CACHE.delete(data.record.id);
    });
}


export { pb, initDb, CACHE_TIMEOUT, DASH_CACHE }; 