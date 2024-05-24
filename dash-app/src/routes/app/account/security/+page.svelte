<script lang="ts">
    import { goto, replaceState } from "$app/navigation";
    import { page } from "$app/stores";
    import type { DashUser } from "$lib/auth/dash";
    import {
        Note,
        Text,
        FieldSet,
        Spacer,
        Button,
        Card,
        Snippet,
        Details,
        Toggle,
        Center,
    } from "geist-ui-svelte";

    import { onMount } from "svelte";
    import PasswordDialogue from "../../../components/dialogue/PasswordDialogue.svelte";
    import MessageDialogue from "../../../components/dialogue/MessageDialogue.svelte";
    import ActionDialogue from "../../../components/dialogue/ActionDialogue.svelte";
    import OtpInput from "../../../components/OTPInput.svelte";

    // hack workaround
    function changeBackground(elem_id: string) {
        const parent = document.getElementById(elem_id);
        const target = parent.childNodes[0].childNodes[0];
        (target as HTMLElement).classList.add("dark:bg-gray-975/100");
        (target as HTMLElement).classList.remove("dark:bg-gray-999");
    }

    let showMessage = false;
    let messageTitle = "";
    let messageContent = "";

    let setPasswordPrompt = false;
    let changePasswordPrompt = false;
    let verifyPasswordPrompt = false;
    let verifyPasswordReason: "clear-totp" | "set-totp";

    let totpSetupPrompt = false;
    let totpClearPrompt = false;
    let verifiedPassword = "";
    //let invertAllowed = true;

    let otp_secret = "";
    let otp_qr = "";
    let otp_algo = "";
    let otp_url = "";
    let otp_response_value = ["", "", "", "", "", ""];

    let sessionId = "";
    let userId = "";
    let userName = "";
    let loginMethods = [];
    let OAuth2_Id = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/account/security");
        //replaceState("/app/account/security", { });
        //changeBackground("password-action-card");
        //changeBackground("totp-action-card");

        const dashAccount = $page.data.dash_account as DashUser;

        userId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        OAuth2_Id = dashAccount.oauth2_id;
        sessionId = $page.data.session_id;
    });
</script>

<div class="w-full">
    <Note label={false} color="warning">
        <div class="flex flex-row gap-x-2">
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
        Changing security settings will invalidate all sessions including this
        one. You will need to sign in again after making changes.
        </div>
    </Note>

    <Card class="p-6 mt-4 shadow-2xl">
        <Text
            type="h4"
            class="font-normal flex flex-row place-items-center gap-x-2"
            >Discord OAuth2
            <Text
                size="xs"
                blockquote
                color={loginMethods.includes("OAuth2")
                    ? "inherit"
                    : "secondary"}
                >{loginMethods.includes("OAuth2")
                    ? "Active"
                    : "Unavailable"}</Text
            >
        </Text>
        {#if !loginMethods.includes("OAuth2") && OAuth2_Id}
            <Spacer h={8} />
            <Note label={false} color="default">
                <Text size="sm">
                    OAuth2 sign in is disabled for this account. Please contact
                    a Dash administrator to resolve this issue.
                </Text>
            </Note>
            <Spacer h={10} />
        {/if}
        <Text size="sm" class="dark:text-gray-200">
            {#if OAuth2_Id}
                Your Dash account is linked to your Discord account. You can use this as an alternative to your password, if set.
            {:else}
                Your Dash account is not linked to a Discord account.
            {/if}
        </Text>
        {#if OAuth2_Id}
            <Spacer h={10} />
            <Text size="sm" class="self-center">OAuth2 Client ID:</Text>
            <Snippet type="lite" text={OAuth2_Id} symbol="" />
            <Spacer h={15} />
            <Details label="Link to a different account" animate>
                <Text size="xs">
                    <p>
                        If you need to link your Dash account to a different
                        Discord account, please contact support and we will help you out.
                        <Text b>
                            If you have accidentally created a new Dash account
                            by logging in using OAuth2 with your new Discord
                            account, please delete that Dash account before
                            linking your new Discord account.
                        </Text>
                    </p>
                </Text>
            </Details>
        {/if}
    </Card>

    <div class="mt-4" id="password-action-card">
        <FieldSet>
            <div class="p-2">
                <Text
                    type="h4"
                    class="font-normal flex flex-row place-items-center gap-x-2"
                >
                    Password Self-Service
                    <Text
                        size="xs"
                        blockquote
                        color={loginMethods.includes("Password")
                            ? "inherit"
                            : "secondary"}
                        >{loginMethods.includes("Password")
                            ? "Available"
                            : "No Password"}</Text
                    >
                </Text>

                <Text size="sm" class="dark:text-gray-200">
                    {#if loginMethods.includes("Password")}
                        Manage your account password.
                    {:else}
                        Your account isn't using a password to sign in.
                    {/if}
                </Text>
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
                    <Button
                        color="secondary-light"
                        size="sm"
                        on:click={() => (changePasswordPrompt = true)}
                        >Change Password</Button
                    >
                {:else}
                    <Button
                        color="success-light"
                        size="sm"
                        on:click={() => (setPasswordPrompt = true)}
                        >Add Password</Button
                    >
                {/if}
            </div>
        </FieldSet>
    </div>

    <div class="mt-4" id="totp-action-card">
        <FieldSet>
            <div class="p-2">
                <Text
                    type="h4"
                    class="font-normal flex flex-row place-items-center gap-x-2"
                    >Multi-Factor Authentication (MFA)
                    <Text
                        size="xs"
                        blockquote
                        color={loginMethods.includes("TOTP")
                            ? "inherit"
                            : "secondary"}
                        >{loginMethods.includes("Password")
                            ? loginMethods.includes("TOTP")
                                ? "Enabled"
                                : "Disabled"
                            : "Unavailable"}</Text
                    >
                </Text>
                <Text size="sm" class="dark:text-gray-200"
                    >Manage your Dash account MFA settings.</Text
                >
                <Spacer h={10} />
            </div>
            <div slot="footer" class="flex justify-end">
                <div class="flex flex-row gap-x-2">
                    {#if loginMethods.includes("Password")}
                        <Button
                            color="success-light"
                            size="sm"
                            on:click={() => {
                                verifyPasswordReason = "set-totp";
                                verifyPasswordPrompt = true;
                            }}>Add Authenticator</Button
                        >
                    {/if}
                    {#if loginMethods.includes("TOTP")}
                        <Button
                            color="secondary-light"
                            size="sm"
                            on:click={() => {
                                verifyPasswordReason = "clear-totp";
                                verifyPasswordPrompt = true;
                            }}>Reset MFA</Button
                        >
                    {/if}
                    {#if !loginMethods.includes("Password") && !loginMethods.includes("TOTP")}
                        <Text size="sm"
                            >Multi-factor authentication options unavailable.</Text
                        >
                    {/if}
                </div>
            </div>
        </FieldSet>
    </div>
</div>

<MessageDialogue
    bind:show={showMessage}
    title={messageTitle}
    message={messageContent}
    buttonText="OK"
/>

<PasswordDialogue
    bind:show={setPasswordPrompt}
    mode="set"
    action={(e, pw) => {
        fetch(`/api/account/password`, {
            method: "POST",
            headers: {
                "X-Dash-SessionId": sessionId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: pw,
            }),
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                messageTitle = "Password Added";
                messageContent =
                    "Your Dash account is now protected with a password. You will be logged out for security reasons.";
                showMessage = true;
                setTimeout(() => goto(res.goto), 3000);
            } else {
                messageTitle = "Password Set Failed";
                messageContent =
                    "Failed to set password. Reason: " + res.reason;
                showMessage = true;
            }
        });
    }}
/>

<PasswordDialogue
    bind:show={changePasswordPrompt}
    mode="change"
    action={(e, pw, oldpw) => {
        fetch(`/api/account/password`, {
            method: "PUT",
            headers: {
                "X-Dash-SessionId": sessionId,
                "X-Dash-OldPw": oldpw,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: pw,
            }),
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                messageTitle = "Password Updated";
                messageContent =
                    "Your Dash account password has been updated. You will be logged out for security reasons.";
                showMessage = true;
                setTimeout(() => goto(res.goto), 3000);
            } else {
                messageTitle = "Password Change Failed";
                messageContent =
                    "Failed to change password. Reason: " + res.reason;
                showMessage = true;
            }
        });
    }}
/>

<PasswordDialogue
    bind:show={verifyPasswordPrompt}
    mode="confirm"
    action={(e, pw) => {
        fetch(`/api/account/password`, {
            method: "GET",
            headers: {
                "X-Dash-SessionId": sessionId,
                "X-Dash-Pw": pw,
                "Content-Type": "application/json",
            },
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                if (verifyPasswordReason === "set-totp") {
                    fetch(`/api/account/mfa`, {
                        method: "GET",
                        headers: {
                            "X-Dash-SessionId": sessionId,
                            "X-Dash-Pw": pw,
                            "Content-Type": "application/json",
                        },
                    }).then(async (r) => {
                        const res = await r.json();
                        if (r.status === 200) {
                            otp_secret = res.secret;
                            otp_qr = res.qr;
                            otp_algo = res.algorithm;
                            otp_url = res.url;
                            verifiedPassword = pw;
                            totpSetupPrompt = true;
                        } else {
                            messageTitle = "MFA Setup Failed";
                            messageContent =
                                "Failed to setup MFA. Reason: " + res.reason;
                            showMessage = true;
                        }
                    });
                } else if (verifyPasswordReason === "clear-totp") {
                    verifiedPassword = pw;
                    totpClearPrompt = true;
                } else {
                    messageTitle = "Password Verified";
                    messageContent =
                        "Thanks for verifying your password. You may continue your action.";
                    showMessage = true;
                }
            } else if (r.status === 403) {
                messageTitle = "Incorrect Password";
                messageContent =
                    "The password you entered was incorrect. Please try again.";
                showMessage = true;
            } else {
                messageTitle = "Password Check Failed";
                messageContent =
                    "Failed to check password. Reason: " + res.reason;
                showMessage = true;
                //throw `Password check failed: ${await r.text()}`;
            }
        });
    }}
/>

<ActionDialogue
    bind:show={totpClearPrompt}
    title="Remove MFA"
    message="Are you sure you want to remove MFA?"
    actionBtnColor="error"
    actionButtonText="Remove MFA"
    action={() => {
        fetch(`/api/account/mfa`, {
            method: "DELETE",
            headers: {
                "X-Dash-SessionId": sessionId,
                "X-Dash-Pw": verifiedPassword,
                "Content-Type": "application/json",
            },
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                messageTitle = "Removed MFA";
                messageContent =
                    "Your multi-factor authentication settings were reset.";
                showMessage = true;
                setTimeout(() => location.reload(), 3000);
            } else {
                messageTitle = "MFA Setup Failed";
                messageContent = "Failed to remove MFA. Reason: " + res.reason;
                showMessage = true;
            }
        });
    }}
/>

<ActionDialogue
    bind:show={totpSetupPrompt}
    title="Add Authenticator"
    message="Scan the QR code to add a new authenticator app."
    action={() => {
        fetch(`/api/account/mfa`, {
            method: "POST",
            headers: {
                "X-Dash-SessionId": sessionId,
                "X-Dash-Pw": verifiedPassword,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: otp_response_value.join(""),
                secret: otp_secret,
            }),
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                messageTitle = "Authenticator Added";
                messageContent =
                    "You can use your authenticator app as a second step to securely log into your Dash account.";
                showMessage = true;
                setTimeout(() => location.reload(), 3000);
            } else {
                messageTitle = "MFA Setup Failed";
                messageContent = "Failed to setup MFA. Reason: " + res.reason;
                showMessage = true;
            }
        });
    }}
    actionBtnColor="success"
    actionButtonText="Add Authenticator"
>
    <Spacer h={10} />
    <img
        src="data:image/png;base64,{otp_qr}"
        draggable="false"
        on:dragstart={() => false}
        class="rounded-2xl select-none pointer-events-none security-image"
        alt="OTP QR"
    />

    <!--
                    style={$mode === "dark" && invertAllowed ? "filter:invert(100%);" : ""} 
        <Spacer h={10} />
                    {#if !invertAllowed}
        <Spacer h={10} />
    {/if}
    <Center>
        <div class="flex flex-row gap-x-2">
            <Text size="xs">Use Themed QR Code</Text>
            <Toggle color="secondary" bind:checked={invertAllowed} />
        </div>
    </Center>
    -->
    <Spacer h={20} />
    <div>
        <Details label="Can't scan the QR code?" animate>
            <div class="text-xs flex flex-col gap-y-2">
                <div class="flex flex-col">
                    <Text size="xs">Secret:</Text>
                    <Text size="xs" blockquote>{otp_secret}</Text>
                </div>
                <div class="flex flex-col">
                    <Text size="xs">Algorithm:</Text>
                    <Text size="xs" blockquote>{otp_algo}</Text>
                </div>
            </div>
        </Details>
    </div>
    <Spacer h={20} />
    <Text align="center" size="xs" color="secondary">
        Enter the code displayed on your authenticator app to confirm.
    </Text>
    <Spacer h={20} />
    <div class="flex justify-between min-w-fit w-[75%] space-x-2 h-10">
        <OtpInput bind:otp={otp_response_value} />
    </div>
    <Spacer h={20} />
</ActionDialogue>

<style>
    .security-image {
        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>
