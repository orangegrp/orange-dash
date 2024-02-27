<script lang="ts">
    import { goto } from "$app/navigation";
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
    } from "geist-ui-svelte";

    import { onMount } from "svelte";
    import PasswordDialogue from "../../../components/dialogue/PasswordDialogue.svelte";
    import ActionDialogue from "../../../components/dialogue/ActionDialogue.svelte";

    // hack workaround
    function changeBackground(elem_id: string) {
        const parent = document.getElementById(elem_id);
        const target = parent.childNodes[0].childNodes[0];
        (target as HTMLElement).classList.add("dark:bg-gray-975/100");
        (target as HTMLElement).classList.remove("dark:bg-gray-999");
    }

    let setPasswordPrompt = false;
    let changePasswordConfirmation = false;
    let changePasswordPrompt = false;

    let userName = "";
    let dashId = "";
    let loginMethods = [];
    let oauth2id = "";

    onMount(() => {
        changeBackground("password-action-card");
        changeBackground("totp-action-card");

        const dashAccount = $page.data.dash_account as DashUser;

        dashId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        oauth2id = dashAccount.oauth2_id;
    });

    let totpAddConfirmation;
    let totpResetConfirmation;

    /*
    let otp = ["", "", "", "", "", ""];

    function focusNext(event, index) {
        if (index === 5) {
            //passwordInput2 = otp.join("");
        }

        if (event.target.value.length >= 1) {
            event.target.nextElementSibling.focus();
        }
    }

    let totpAddConfirmationAfterPasswordValidation = false;

    let qrcode = "";
    let otpurl = "";
    let otpsecret = "";

    let totpAddConfirmation = false;
    let totpResetConfirmation = false;

    function handleBackspace(event, index) {
        if (event.key === "Backspace" && event.target.value === "") {
            event.target.previousElementSibling.focus();
        }
    }
    */
</script>

<div class="w-full">
    <Note label={false} color="warning">
        Changing security settings will invalidate all sessions including this
        one. You will need to sign in again after making changes.
    </Note>

    <Card shadow class="p-6 mt-4">
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
        {#if !loginMethods.includes("OAuth2") && oauth2id}
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
            {#if oauth2id}
                Your Dash account is linked to your Discord account.
            {:else}
                Your Dash account is not linked to a Discord account.
            {/if}
        </Text>
        {#if oauth2id}
            <Spacer h={10} />
            <Text size="sm" class="self-center">OAuth2 Client ID:</Text>
            <Snippet type="lite" text={oauth2id} symbol="" />
            <Spacer h={15} />
            <Details label="Link to a different account" animate>
                <Text size="xs">
                    <p>
                        If you need to link your Dash account to a different
                        Discord account, please contact a Dash administrator.
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
        <FieldSet color="transparent">
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
                        on:click={() => (changePasswordConfirmation = true)}
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
        <FieldSet color="transparent">
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
                            on:click={() => (totpAddConfirmation = true)}
                            >Add Authenticator</Button
                        >
                    {/if}
                    {#if loginMethods.includes("TOTP")}
                        <Button
                            color="secondary-light"
                            size="sm"
                            on:click={() => (totpResetConfirmation = true)}
                            >Reset MFA</Button
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

<PasswordDialogue
    bind:show={setPasswordPrompt}
    mode="set"
    action={(e, pw) => {
        fetch(`/api/account/password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: pw,
            }),
        }).then(async (r) => {
            goto((await r.json()).goto);
        });
    }}
/>

<ActionDialogue
    bind:show={changePasswordConfirmation}
    title="Change Password"
    message="Changing your password will reset any multi-factor authentication steps you have configured."
    txtColor="warning"
    actionBtnColor="warning"
    actionButtonText="I understand"
    action={() => (changePasswordPrompt = true)}
>
    <Spacer h={5} />
    <Text color="secondary" size="xs" align="center">
        Multi-factor authentication secret data is securely encrypted using
        AES-256-GCM with a key derived from your password in memory. This
        password is never stored on our servers.
    </Text>
</ActionDialogue>

<PasswordDialogue
    bind:show={changePasswordPrompt}
    mode="change"
    action={(e, pw, oldpw) => {
        fetch(`/api/account/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                old_password: oldpw,
                password: pw,
            }),
        }).then(async (r) => {
            goto((await r.json()).goto);
        });
    }}
/>

<!--





<Modal
    bind:visible={totpResetConfirmation}
    class="sm:w-[50vw] md:w-[40vw] lg:w-[25vw] xl:w-[20w] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
	 justify-center"
    >
        <Text type="h5">Reset MFA</Text>
        <Spacer h={10} />
        <Text align="center" color="secondary">
            Existing authenticators will be invalidated. You may be logged out
            on other sessions.
        </Text>
        <Spacer h={20} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button
                width="100%"
                color="error"
                on:click={() => {
                    fetch(`/api/account/mfa/reset`, {
                        method: "POST",
                    }).then(async (r) => {
                        let result = await r.json();
                        if (result.success) {
                            totpResetConfirmation = false;
                            window.location.href = window.location.href;
                        } else {
                            goto(result.goto);
                        }
                    });
                }}
            >
                Reset MFA
            </Button>
            <Button
                width="100%"
                on:click={() => (totpResetConfirmation = false)}
            >
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>

<Modal
    bind:visible={totpAddConfirmation}
    class="sm:w-[50vw] md:w-[40vw] lg:w-[25vw] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
 justify-center"
    >
        <Text type="h5">Verify Password</Text>
        <Spacer h={10} />
        <Text align="center" color="secondary">
            Please enter your Dash account password to continue.
        </Text>
        <Spacer h={10} />
        <Input type="password" bind:value={passwordInput1} width="100%" />
        <Spacer h={30} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button
                width="100%"
                color="success"
                on:click={() => {
                    fetch(`/api/account/mfa`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: passwordInput1,
                        }),
                    }).then(async (r) => {
                        let result = await r.json();
                        if (result.success) {
                            totpAddConfirmation = false;
                            console.log(result);
                            otpsecret = result.secret;
                            qrcode = result.qrcode;
                            otpurl = result.url;
                            setTimeout(
                                () =>
                                    (totpAddConfirmationAfterPasswordValidation = true),
                                100,
                            );
                        } else {
                            goto(result.goto);
                        }
                    });
                }}
            >
                Confirm
            </Button>
            <Button
                width="100%"
                on:click={() => {
                    passwordInput1 = "";
                    totpAddConfirmation = false;
                }}
            >
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>

<Modal
    bind:visible={totpAddConfirmationAfterPasswordValidation}
    class="sm:w-[50vw] min-w-fit md:w-[40vw] lg:w-[25vw] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
 justify-center"
    >
        <Text type="h5">Add Authenticator</Text>
        <Spacer h={10} />
        <Text align="center" color="secondary">
            Scan the QR code to add a new authenticator app.
        </Text>
        <Spacer h={10} />
        <img
            src="data:image/png;base64,{qrcode}"
            draggable="false"
            on:dragstart={() => false}
            class="rounded-2xl select-none pointer-events-none security-image"
            alt="qrcode"
        />
        <Spacer h={10} />
        <div>
            <Details label="Can't scan the QR code?" animate>
                <div class="text-xs flex flex-col gap-y-2">
                    <div class="flex flex-col">
                        <Text size="xs">Secret:</Text>
                        <Text size="xs" blockquote>{otpsecret}</Text>
                    </div>
                    <div class="flex flex-col">
                        <Text size="xs">Algorithm:</Text>
                        <Text size="xs" blockquote>SHA1</Text>
                    </div>
                </div>
            </Details>
        </div>
        <Spacer h={20} />
        <Text align="center" size="xs" color="secondary">
            Enter the code displayed on your authenticator app to confirm.
        </Text>
        <Spacer h={20} />
        <div
            class="otp-container space-x-4 flex flex-row text-center justify-center"
        >
            {#each otp as digit, index}
                <input
                    autocapitalize="off"
                    autocorrect="off"
                    spellcheck="false"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    type="tel"
                    id="totp_{index}"
                    name="totp_{index}"
                    maxlength="1"
                    class="text-center otp-input bg-transparent order-3 w-8 h-8 min-w-2 text-gray-900 dark:text-gray-100 border dark:border-gray-900 rounded-lg"
                    bind:value={otp[index]}
                    on:keydown={(event) => handleBackspace(event, index)}
                    on:input={(event) => focusNext(event, index)}
                />
            {/each}
        </div>
        <Spacer h={30} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button
                width="100%"
                color="success"
                on:click={() => {
                    fetch(`/api/account/mfa`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: passwordInput1,
                            code: passwordInput2,
                            secret: otpsecret,
                        }),
                    }).then(async (r) => {
                        passwordInput1 = "";
                        passwordInput2 = "";
                        let result = await r.json();
                        if (result.success) {
                            totpAddConfirmation = false;
                            totpAddConfirmationAfterPasswordValidation = false;
                        } else {
                            goto(result.goto);
                        }
                    });
                }}
            >
                Add Authenticator
            </Button>
            <Button
                width="100%"
                on:click={() => {
                    passwordInput1 = "";
                    passwordInput2 = "";
                    totpAddConfirmationAfterPasswordValidation = false;
                }}
            >
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>

-->

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
