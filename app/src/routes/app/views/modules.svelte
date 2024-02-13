<script lang="ts">
    import { onMount } from "svelte";
    import { appRailModules } from "$lib/store";

    import News from "../components/modules/news/+page.svelte";
</script>

<head>
    <title> Dash </title>
</head>

<div class="container flex flex-col space-y-8 md:space-x-16 sm:flex-row p-4 lg:p-8 md:h-full">
    <nav class="navigation card rounded-3xl p-6 shadow-2xl min-w-fit pr-8">
        <h3 class="h3 k-bold mb-2 pr-8">Choose a module</h3>
        <nav>
            <ul class="space-y-2">
                <li>
                    <button class="text-left rounded-3xl p-2 pl-4 hover:bg-primary-900 active:bg-primary-600 w-full" on:click={() => {$appRailModules = 0}}>
                        News
                    </button>
                </li>
            </ul>
        </nav>
    </nav>
    <div class="content">
        {#if $appRailModules == 0}
            <News/>
        {/if}
    </div>
</div>
