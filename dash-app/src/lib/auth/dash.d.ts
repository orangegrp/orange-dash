import type { RecordModel } from "pocketbase";

type DashLoginMethods = "Password" | "TOTP" | "OAuth2" | "QR";
type DashRole = "Root" | "Admin" | "User" | "OAuth2User";

type DashUser = Partial<RecordModel> & {
    username?: string,
    password?: string,
    salt?: string,
    totp_secret?: string,
    login_methods: [...Set<DashLoginMethods>],
    locked: boolean,
    role: DashRole,
    oauth2_id?: string,
    abac_str?: string
}

type DashSession = Omit<DashUser, "password" | "salt" | "totp_secret" | "locked" | "created" | "updated"> & { dash_id: string, guilds?: string[] };

export type { DashUser, DashRole, DashLoginMethods, DashSession };