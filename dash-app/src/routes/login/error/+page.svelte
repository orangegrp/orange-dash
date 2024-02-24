<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "../../components/Icon.svelte";
    import { Note, Text, Button } from "geist-ui-svelte";

    const loginErrorMessages: string[] = [
        "Unknown reason",
        "Invalid username or password",
        "TOTP code expired",
        "Login service not available"
    ];

    let loginErrorMessage = "Unknown";

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loginErrorCode: number = urlParams.has("reason") ? Number(urlParams.get("reason")) !== Number.NaN && Number(urlParams.get("reason")) > 0 && Number(urlParams.get("reason")) < 4 ? Number(urlParams.get("reason")) : 0 : 0;

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
                <Button type="button" width=100%>
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
