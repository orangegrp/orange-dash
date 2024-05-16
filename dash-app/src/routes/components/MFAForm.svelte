<script lang="ts">
    import {
        Text,
        Spacer,
        Checkbox,
        Button,
        Key,
        Center,
    } from "geist-ui-svelte";
    import Icon from "./Icon.svelte";
    import { Modal } from "geist-ui-svelte";
    import { Turnstile } from "svelte-turnstile";
    import { mode } from "mode-watcher";
    import OtpInput from "./OTPInput.svelte";
    import Spinner from "./Spinner.svelte";

    let showForgotOtp: boolean = false;
    let buttonLoading: boolean = false;
    let mfa_form: HTMLFormElement;
    let show_form: boolean = false;
</script>

<div
    class="flex justify-between border-gray-150
    dark:border-gray-900 py-6 border max-w-[350px] sm:max-w-[480px] w-full h-fit px-4 sm:px-8 rounded-xl md:rounded-3xl {$mode ===
    'light'
        ? 'card-border-light'
        : 'card-border-black'}"
>
    <form
        bind:this={mfa_form}
        action="/login/mfa"
        method="post"
        class="flex-grow flex w-full flex-col place-items-start justify-center"
    >
        <div class="flex flex-row gap-x-2 mb-1">
            <Icon
                dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
                light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
                width="32"
                height="32"
                alt="Logo"
            />
            <strong translate="no"> orange Dash Account </strong>
        </div>
        <div class={show_form ? "display" : "hidden"}>
            <Text type="small" color="secondary"
                >One-Time Passcode</Text
            >
            <Spacer h={3} />
            <div class="otp-container w-full space-x-2 h-10">
                <OtpInput bind:mfa_form bind:buttonLoading />
            </div>

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
                        on:click={() => (showForgotOtp = true)}>No OTP?</button
                    >
                </Text>
            </div>
        </div>
        {#if !show_form}
            <Spacer h={20} />
            <div class="w-full flex justify-center">
                <Spinner />
            </div>
        {/if}
        <Spacer h={15} />
        <Turnstile
            siteKey="1x00000000000000000000BB"
            on:turnstile-callback={() => (show_form = true)}
        />
        {#if show_form}
            <Spacer h={15} />
            <Button
                type="submit"
                width="100%"
                color="success-light"
                loading={buttonLoading}
            >
                <Text size="sm">
                    {#if !buttonLoading}
                        Continue
                    {/if}
                </Text>
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
        {/if}
    </form>
</div>

<Modal bind:visible={showForgotOtp} class="sm:w-[640px] h-fit">
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
    .otp-container {
        display: flex;
        justify-content: space-between;
    }
</style>
