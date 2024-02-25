<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "../../components/Icon.svelte";
    import { Note, Text, Button, Spacer } from "geist-ui-svelte";

    const loginErrorMessages: string[] = [
        "Unknown reason",                   // 0
        "Invalid username or password",     // 1
        "TOTP code expired",                // 2
        "Login service not available",      // 3
        "OAuth2 authorization failed",      // 4
        "CAPTCHA",                          // 5
        "Accont locked. Contact support",   // 6
    ];

    let loginErrorMessage = "Unknown";

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loginErrorCode: number = urlParams.has("reason")
            ? Number(urlParams.get("reason")) !== Number.NaN &&
              Number(urlParams.get("reason")) > 0 &&
              Number(urlParams.get("reason")) < 7
                ? Number(urlParams.get("reason"))
                : 0
            : 0;

        loginErrorMessage = loginErrorMessages[loginErrorCode];
    });
</script>

<main
    class="flex w-full items-center login-container-min-height justify-center"
>
    <div class="dark:bg-black bg-gray-50 shadow-lg">
        <div
            class="flex flex-col border-gray-150
        dark:border-gray-900 py-6 border max-w-[480px] w-full px-8 rounded-xl md:rounded-3xl"
        >
            <div class="flex flex-row gap-x-2 mb-4">
                <Icon
                    dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
                    light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
                    width="32"
                    height="32"
                    alt="Logo"
                />
                <strong> orange Dash Account </strong>
            </div>
            <div class="flex flex-col gap-2">
                <Note color="error">
                    <Text slot="label" b>Authentication failed:</Text>
                    {loginErrorMessage}
                </Note>
                <Button type="button" width="100%" href="/login">
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
                            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                        />
                    </svg>
                    <Spacer w={10} />
                    Try again
                </Button>
            </div>
        </div>
    </div>
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
</style>
