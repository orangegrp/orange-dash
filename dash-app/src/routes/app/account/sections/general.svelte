<script lang="ts">
    import type { DashSession, DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    import {
        Card,
        Text,
        Spacer,
        Snippet,
        Badge,
        Details,
    } from "geist-ui-svelte";

    let userName = "";
    let dashId = "";
    let loginMethods = [];
    let oauth2id = "";
    let accountType = "";

    onMount(() => {
        const dashAccount = $page.data.dash_account as DashUser;
        console.log(dashAccount);

        dashId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        oauth2id = dashAccount.oauth2_id;
        accountType = dashAccount.role;
    });
</script>

<div class="w-full">
    <Card shadow class="p-6">
        <Text type="h4" class="font-normal">Account Information</Text>
        <Spacer h={10} />

        <div class="space-y-2">
            {#if userName}
                <div>
                    <Text size="sm" class="self-center mr-1">Username:</Text>
                    <Text blockquote size="sm" class="font-mono"
                        >{userName}</Text
                    >
                </div>
            {/if}
            {#if accountType}
                <div>
                    <Text size="sm" class="dark:text-gray-200 self-center mr-1">
                        Account Type: <Text blockquote>{accountType}</Text>
                    </Text>
                </div>
            {/if}
            {#if loginMethods}
                <div>
                    <Text size="sm" class="dark:text-gray-200 self-center mr-1">
                        Login methods:
                        {#each loginMethods as loginMethod}
                            <Text blockquote class="mr-1">{loginMethod}</Text>
                        {/each}
                    </Text>
                </div>
            {/if}
            {#if dashId}
                <div>
                    <Text size="sm" class="self-center">Dash Account ID:</Text>
                    <Snippet type="lite" text={dashId} symbol="" />
                </div>
            {/if}
            {#if oauth2id}
                <div>
                    <Text size="sm" class="self-center">OAuth2 Client ID:</Text>
                    <Snippet type="lite" text={oauth2id} symbol="" />
                </div>
            {/if}
        </div>

        <div class="mt-4">
            <Details label="Additional information" animate>
                <ul class="text-xs list-disc ml-8">
                    {#if userName}
                        <li>
                            {#if loginMethods.includes("Password")}
                                Your username can be used to sign into Dash.
                            {:else}
                                Your username is used for display purposes only.
                                You can't sign in using this method.
                            {/if}
                        </li>
                    {/if}
                    <li>
                        If you want to change your username, please contact a
                        Dash administrator.
                    </li>
                    <li>
                        If you need to link your Dash account to a new Discord
                        OAuth2 Client, please contact a Dash administrator.
                    </li>
                </ul>
            </Details>
        </div>
    </Card>
</div>
