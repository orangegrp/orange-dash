<script lang="ts">
    import { Loading, Center } from "geist-ui-svelte";
    import Icon from "../../components/Icon.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        setTimeout(() => {
            window.location.href = "/app";
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
</style>
