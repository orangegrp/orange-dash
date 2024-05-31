<script lang="ts">
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        Card,
        Text,
        Spacer,
        Snippet,
        Details,
        Note,
        Button,
        Hero,
    } from "geist-ui-svelte";
    import { replaceState } from "$app/navigation";
    import ActionDialogue from "../../../components/dialogue/ActionDialogue.svelte";
    import QrScanner from "../../../components/QRScanner.svelte";

    let userId = "";
    let userName = "";
    let loginMethods = [];
    let OAuth2_Id = "";
    let accountType = "";

    let scanQRcodePopup = false;
    let confirmLoginAllow = false;

    onMount(() => {
        window.history.replaceState({}, "", "/app/account/general");
        //replaceState("/app/account/general", { });
        const dashAccount = $page.data.dash_account as DashUser;

        userId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        OAuth2_Id = dashAccount.oauth2_id;
        accountType = dashAccount.role;
    });
</script>

<div class="w-full flex flex-col gap-y-4">
    <Card class="p-6 shadow-2xl ">
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
            {#if userId}
                <div>
                    <Text size="sm" class="self-center">Dash Account ID:</Text>
                    <Snippet type="lite" text={userId} symbol="" />
                </div>
            {/if}
            {#if OAuth2_Id}
                <div>
                    <Text size="sm" class="self-center">OAuth2 Client ID:</Text>
                    <Snippet type="lite" text={OAuth2_Id} symbol="" />
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

    <Card class="p-6 shadow-2xl">
        <Text type="h4" class="font-normal">QR Code Login</Text>
        <Text size="sm" class="dark:text-gray-200">
            You can now use a QR code to instantly login to your Dash account on
            another device.
        </Text>
        <Spacer h={15} />
        <Note label={false} color="warning">
            <div class="flex flex-row gap-x-2 items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#fb923c"
                    class="min-w-6 min-h-6 w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                </svg>
                <div>
                    <strong class="font-black text-lg">STOP AND THINK!</strong>
                    <p>
                        If you received a picture of a QR code and have been
                        asked to scan it, please <strong>do not</strong>. It is
                        100% a scam and they're trying to hijack your account
                        and personal data.
                    </p>
                </div>
            </div>
        </Note>
        <Spacer h={20} />
        
        <Text size="sm">
            To scan the QR code, please click the button below and follow the
            instructions. Only scan the QR code that is displayed on your own device
            and the browser web address begins with the following: <Text blockquote b class="!text-emerald-500 !font-mono">{$page.url.origin}</Text>

        </Text>
        <Spacer h={5} />
        <Text size="sm">
            If the web address does not look like the above, <Text b color="warning">do not</Text> scan the QR code or enter your Dash account credentials as
            it is most likely a phishing page designed to steal your credentials.
        </Text>
        <Spacer h={25} />
        <Button color="success" on:click={() => (scanQRcodePopup = true)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                />
            </svg>
            <Text size="sm">Scan a QR Code</Text>
        </Button>
        <Spacer h={10} />
    </Card>
</div>

<ActionDialogue
    bind:show={scanQRcodePopup}
    title="QR Code Login"
    action={() => {}}
    actionBtnColor="success"
    actionButtonText="Add Authenticator"
    bind:showActionButton={confirmLoginAllow}
>
    <QrScanner bind:notdone={scanQRcodePopup}></QrScanner>
</ActionDialogue>
