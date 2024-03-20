<script lang="ts">
    import { Text } from "geist-ui-svelte";
    import { mode } from "mode-watcher";

    export let Title: string;
</script>

<header
    class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48 flex flex-row justify-between"
>
    <Text type="h3" class="font-light">{Title}</Text>
    <slot />
</header>

<style>
    /*

    {$mode === "light" ? "header-light" : "header-dark"}


    .header-dark {
        --color-bg-0: black;
        --color-bg-1: #ff84005d;
        background-image: radial-gradient(
            25% 75% at 0% 0%,
            var(--color-bg-1) 0%,
            var(--color-bg-0) 150%
        );
    }

    .header-light {
        --color-bg-0: rgb(255, 255, 255);
        --color-bg-1: #ff84005d;
        background-image: radial-gradient(
            25% 75% at 0% 0%,
            var(--color-bg-1) 0%,
            var(--color-bg-0) 150%
        );
    }
    */
</style>
