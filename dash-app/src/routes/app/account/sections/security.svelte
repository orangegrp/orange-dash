<script lang="ts">
    import { page } from "$app/stores";
    import type { DashSession } from "$lib/auth/dash";
    import {
        Note,
        Text,
        FieldSet,
        Spacer,
        Button,
        Modal,
        Input,
        Center,
        Card,
        Badge,
        Snippet,
        Details,
    } from "geist-ui-svelte";
    import { onMount } from "svelte";

    // hack workaround
    function changeBackground(elem_id: string) {
        const parent = document.getElementById(elem_id);
        const target = parent.childNodes[0].childNodes[0];
        (target as HTMLElement).classList.add("dark:bg-gray-975/100");
        (target as HTMLElement).classList.remove("dark:bg-gray-999");
    }

    let userName = "";
    let dashId = "";
    let loginMethods = [];
    let oauth2id = "";

    onMount(() => {
        changeBackground("password-action-card");
        changeBackground("totp-action-card");

        const userSession = $page.data.session as DashSession;

        userName = userSession.username ? `${userSession.username}` : "";
        dashId = userSession.dash_id;
        loginMethods = userSession.login_methods;
        oauth2id = userSession.oauth2_id;
    });
</script>

<div class="w-full">
    <Note label={false} color="warning">
        Changing security settings will invalidate all sessions including this
        one. You will need to sign in again after making changes.
    </Note>

    <Card shadow class="p-6 mt-4">
        <Text type="h4" class="font-bold flex flex-row place-items-center gap-x-2"
            >Discord OAuth2
            <Text
                size="xs"
                blockquote
                color={oauth2id
                    ? "inherit"
                    : "secondary"}
                >{oauth2id
                    ? "Active"
                    : "Unavailable"}</Text
            >
        </Text>
        <Text size="sm">
            {#if oauth2id}
                You are signed in using the Discord OAuth2 service.
            {:else}
                Your account is not signed in using the Discord OAuth2 service.
            {/if}
        </Text>

        {#if oauth2id}
            <Spacer h={10} />
            <Text size="sm" class="self-center">OAuth2 Client ID:</Text>
            <Snippet type="lite" text={oauth2id} symbol="" />
        {/if}
    </Card>

    <div class="mt-4" id="password-action-card">
        <FieldSet color="transparent">
            <div class="p-2">
                <Text type="h4" class="font-bold flex flex-row place-items-center gap-x-2">
                    Password Self-Service
                    <Text
                        size="xs"
                        blockquote
                        color={loginMethods.includes("Password")
                            ? "inherit"
                            : "secondary"}
                        >{loginMethods.includes("Password")
                            ? "Available"
                            : "Unavailable"}</Text
                    >
                </Text>
                <Text size="sm">Manage your account password.</Text>
                <Spacer h={5} />
                <Details label="Learn more about password security" animate>
                    <Text size="xs">
                        <ul class="list-disc ml-8">
                            <li>
                                Aim for 16 characters (randomly generated) or
                                about 4 words.
                            </li>
                            <li>
                                Ensure each password is unique for your accounts
                                (e.g. don't use the same one on Dash as you
                                would for your email).
                            </li>
                            <li>
                                Use a secure password manager such as <a
                                    href="https://bitwarden.com"
                                    class="underline">Bitwarden</a
                                >
                                or
                                <a
                                    href="https://pass.proton.me/"
                                    class="underline">Proton Pass</a
                                >.
                            </li>
                        </ul>
                    </Text>
                </Details>
                <Spacer h={10} />
            </div>
            <div slot="footer" class="flex justify-end">
                {#if loginMethods.includes("Password")}
                    <Button color="secondary-light" size="sm"
                        >Change Password</Button
                    >
                {:else}
                    <Text size="sm">Password self-service unavailable.</Text>
                {/if}
            </div>
        </FieldSet>
    </div>

    <div class="mt-4" id="totp-action-card">
        <FieldSet color="transparent">
            <div class="p-2">
                <Text type="h4" class="font-bold flex flex-row place-items-center gap-x-2"
                    >Multi-Factor Authentication (MFA)
                    <Text
                        size="xs"
                        blockquote
                        color={loginMethods.includes("TOTP")
                            ? "inherit"
                            : "secondary"}
                        >{loginMethods.includes("TOTP")
                            ? "Enabled"
                            : "Disabled"}</Text
                    >
                </Text>
                <Text size="sm">Manage your Dash account MFA settings.</Text>
                <Spacer h={10} />
            </div>
            <div slot="footer" class="flex justify-end">
                {#if loginMethods.includes("Password") && loginMethods.includes("TOTP")}
                    <div class="flex flex-row gap-x-2">
                        <Button color="success-light" size="sm"
                            >Add Authenticator</Button
                        >
                        <Button color="secondary-light" size="sm"
                            >Reset MFA</Button
                        >
                    </div>
                {:else}
                    <Text size="sm"
                        >Multi-factor authentication options unavailable.</Text
                    >
                {/if}
            </div>
        </FieldSet>
    </div>
</div>
