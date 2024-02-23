<script lang="ts">
    import { onMount } from "svelte";
    import { appRailModules } from "$lib/store";

    import News from "../components/modules/news/+page.svelte";

    import {
        Drawer,
        getDrawerStore,
        type DrawerSettings,
    } from "@skeletonlabs/skeleton";

    const drawerStore = getDrawerStore();

    const drawerSettings: DrawerSettings = {
        id: "example-3",
        width: "w-full md:w-[480px]",
        height: "h-full",
        padding: "pl-24 pt-24 pr-4",
        rounded: "rounded-t-xl ",
    };

    drawerStore.open(drawerSettings);
</script>

<head>
    <title> Dash </title>
</head>

<div
    class="container flex flex-col space-y-8 md:space-x-16 sm:flex-row p-4 lg:p-8 md:h-full"
>
    <Drawer>
        <nav class="navigation rounded-3xl p-6 min-w-fit pr-8">
            <h3 class="h3 k-bold mb-2 pr-8">Choose a module</h3>
            <nav>
                <ul class="space-y-2">
                    <li>
                        <button
                            class="text-left rounded-3xl p-2 pl-4 active:bg-surface-active-token hover:bg-surface-hover-token w-full"
                            on:click={() => {
                                $appRailModules = 0;
                                drawerStore.close();
                            }}
                        >
                            News
                        </button>
                    </li>
                </ul>
            </nav>
        </nav>
    </Drawer>
    <div class="content">
        <button
            type="button"
            class="active:bg-surface-active-token hover:bg-surface-hover-token token h-8 rounded-xl mb-4 mt-4"
            on:click={() => drawerStore.open(drawerSettings)}
        >
            <div class="flex space-x-2 flex-row">
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
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
                <span> Modules Selection </span>
            </div>
        </button>
        {#if $appRailModules == 0}
            <News />
        {/if}
    </div>
</div>
