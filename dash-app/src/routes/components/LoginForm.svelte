<script lang="ts">
    import {
        Input,
        Text,
        Spacer,
        Checkbox,
        Button,
        Divider,
        Center,
        Key,
        Badge,
    } from "geist-ui-svelte";
    import Icon from "./Icon.svelte";
    import { Modal } from "geist-ui-svelte";
    import { Turnstile } from "svelte-turnstile";
    import { mode } from "mode-watcher";
    import { onMount } from "svelte";
    import Spinner from "./Spinner.svelte";
    import TextInput from "./TextInput.svelte";

    let showForgotPassword: boolean = false;
    let qrLoginImage: string = "";
    let show_form: boolean = false;

    onMount(() => {
        setTimeout(async () => {
            fetch("/login/qrcode").then(async (res) => {
                if (res.status === 200) {
                    qrLoginImage = (await res.json()).qrcode;
                }
            });
        }, 100);
    });
</script>

<div
    class="flex justify-between border-gray-150
    dark:border-gray-900 py-6 border max-w-[350px] sm:max-w-[480px] w-full
    md:max-w-[1200px] h-fit px-4 sm:px-8 rounded-xl md:rounded-3xl {$mode ===
    'light'
        ? 'card-border-light'
        : 'card-border-black'}"
>
    <form
        action="/login/password"
        method="post"
        class="flex-grow w-screen md:w-full flex flex-col place-items-start justify-center"
    >
        <div class="flex flex-row gap-x-2 mb-2">
            <Icon
                dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
                light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
                width="32"
                height="32"
                alt="Logo"
            />
            <strong translate="no"> orange Dash Account </strong>
        </div>
        <Spacer h={10} />
        <TextInput
            class="w-full"
            type="text"
            placeholder="Username or ID"
            id="username"
            name="username"
        >
            <Text type="small">Username or Account ID</Text>
        </TextInput>
        <Spacer h={10} />
        <TextInput
            class="w-full"
            type="password"
            placeholder="Password"
            id="password"
            name="password"
        >
            <Text type="small" color="secondary">Password</Text>
        </TextInput>
        <Spacer h={15} />
        <div class="flex place-items-center justify-between w-full">
            <Checkbox ring color="success" id="remember" name="remember">
                <Text type="small" color="secondary"
                    >Remember me for 7 days</Text
                >
            </Checkbox>
            <Text type="small">
                <button
                    type="button"
                    on:click={() => (showForgotPassword = true)}
                    >Forgot password?</button
                >
            </Text>
        </div>
        <Spacer h={15} />
        <Turnstile
            siteKey="1x00000000000000000000BB"
            on:turnstile-callback={() => (show_form = true)}
        />
        <Spacer h={15} />
        {#if show_form}
            <Button type="submit" width="100%" color="success-light">
                <Text size="sm">Continue</Text>
                <Spacer w={10} />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                </svg>
            </Button>
        {:else}
            <div class="w-full flex justify-center">
                <Spinner />
            </div>
        {/if}
        <Spacer h={30} />
        <Divider label="Or continue with" />
        <Spacer h={10} />
        <div class="flex place-items-center w-full gap-2">
            <Button
                width="100%"
                on:click={async () => {
                    const oauth2_url =
                        `https://discord.com/oauth2/authorize?client_id=1210923470620463164&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}%2Flogin%2Foauth2%2Fdiscord&scope=identify+guilds`;
                    window.location.href = oauth2_url;
                }}
            >
                <div class="flex place-items-center gap-2" translate="no">
                    <Icon
                        dark="https://assets-global.website-files.com/6257adef93867e50d84d30e2/653714c1f22aef3b6921d63d_636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                        light="https://assets-global.website-files.com/6257adef93867e50d84d30e2/653714c17467993e7b389c83_636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
                        width="16"
                        height="16"
                        alt="Discord"
                    />
                    <Text size="sm">Discord</Text>
                </div>
            </Button>
        </div>
    </form>
    <div class="md:flex w-full flex-grow hidden">
        <Spacer w={50} />
        <Divider vertical width="1px" />
        <Spacer w={50} />
        <Center class="flex-grow w-full flex flex-col gap-1">
            {#if qrLoginImage.length < 1}
                <Spacer h={35} />
                <Spinner />
                <Spacer h={70} />
            {:else}
                <img
                    src="data:image/png;base64,{qrLoginImage}"
                    draggable="false"
                    on:dragstart={() => false}
                    class="rounded-2xl select-none pointer-events-none security-image"
                    alt="Login with QR Code"
                    style={$mode === "dark" ? "filter:invert(0%);" : ""}
                />
                <Spacer h={10} />
            {/if}
            <Text
                type="h2"
                align="center"
                size="lg"
                class="flex flex-row place-items-center gap-2"
                >Login using your phone
                <Badge size="xs" ghost>Beta</Badge>
            </Text>
            <Text type="h3" color="secondary" align="center" size="sm">
                Use the orange Dash mobile site on your phone to scan this QR code.
            </Text>
        </Center>
    </div>
</div>

<Modal bind:visible={showForgotPassword} class="sm:w-[640px] h-fit">
    <div
        class="p-4 flex flex-col place-items-center
	 justify-center h-fit"
    >
        <Text type="h6" align="center">Account Recovery</Text>
        <Text align="center">
            Please contact a Dash administrator to regain access to your
            account.
        </Text>
    </div>
</Modal>

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
