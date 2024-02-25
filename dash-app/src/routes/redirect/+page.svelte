<script lang="ts">
    import { Loading, Center } from "geist-ui-svelte";
    import Icon from "../components/Icon.svelte";
    import { onMount } from "svelte";

    type RedirectTarget = "app" | "login";
    function isValidRedirectTarget(target: string): target is RedirectTarget {
        return target === "app" || target === "login";
    }

    onMount(() => {
        const target = new URLSearchParams(window.location.search).get("target");
        const validTarget = isValidRedirectTarget(target) ? target : "app";

        setTimeout(() => {
            window.location.href = "/" + validTarget;
        }, 1000);
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
            <Center>
                <Loading size="md"/>
            </Center>
        </div>
    </div>
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
    main {
        background-image: radial-gradient(rgb(128, 128, 128, 0.1) 1px, transparent 0);
        background-size: 10px 10px;
        background-position: -16px -32px;
    }
</style>
