<script lang="ts">
    import { onMount } from "svelte";
    import { getSettings, setSettings } from "../newsapi";
    import type { NewsConfig } from "$lib/news";
    import { ProgressRadial, SlideToggle } from "@skeletonlabs/skeleton";
    import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

    import ai_icon from "$lib/images/ai-icon.png";
    import globe_icon from "$lib/images/globe-icon.png";
    import literature_icon from "$lib/images/literature-icon.png";
    import news_icon from "$lib/images/news-icon.png";
    import sync_icon from "$lib/images/sync-icon.png";

    import { getToastStore } from "@skeletonlabs/skeleton";

    const toastStore = getToastStore();

    export var slider_enabled: boolean = false;
    export var slider_override: boolean = false;
    export var slider_crawl: boolean = false;
    export var slider_ai: boolean = false;

    var api_key: string | null = null;

    var _global_settings: Omit<NewsConfig, "guilds"> | undefined = undefined;

    async function updateContent() {
        try {
            _global_settings = undefined;

            const newData: Omit<NewsConfig, "guilds"> = {
                enabled: slider_enabled,
                override: slider_override ? {
                    crawl: slider_crawl,
                    aiSummary: slider_ai
                } : undefined
            };
        
            if (api_key)
                await setSettings(api_key, newData);
    
            toastStore.trigger({
                message: `Global settings updated`,
                background: "variant-filled-success",
            });

            loadContent();

        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                    message: `Failed to update global settings: ${err.message}`,
                    background: "variant-filled-error",
            });
        }
    }

    async function loadContent() {
        api_key = localStorage.getItem("orange-dash-api-key");

        if (!api_key) {
            return;
        }

        try {
            _global_settings = (await getSettings(api_key)).data as Omit<NewsConfig, "guilds">;
            slider_enabled = _global_settings.enabled;
            slider_override = (_global_settings.override
                            ? true
                            : false);
            slider_crawl = _global_settings.override?.crawl ?? false;
            slider_ai = _global_settings.override?.aiSummary ?? false;


            toastStore.trigger({
                message: `Global settings loaded`,
                background: "variant-filled-success",
            });

            setTimeout(() => {
                toastStore.trigger({
                    message: `Refreshing global settings`,
                    background: "variant-filled",
                });
                loadContent();
            }, 3000000);
        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to load global settings: ${err.message}`,
                background: "variant-filled-error",
            });

            setTimeout(() => {
                toastStore.trigger({
                    message: `Loading global settings`,
                    background: "variant-filled",
                });
                loadContent();
            }, 10000);
        }
    }

    onMount(() => {    
        setTimeout(() => loadContent(), 1000);
    });
</script>

<div class="w-full flex justify-center">
    {#if !_global_settings}
        
    <ProgressRadial/>

    {:else}
        <div class="card p-6 pr-12 shadow-2xl pb-12 w-full">
            <h3 class="h3 k-bold mb-4 mt-2">Global settings</h3>
            <SlideToggle
                bind:checked={slider_enabled}
                name="slider-large"
                active="bg-primary-500"
                size="sm"
                class="mb-4"
            >
            <div>
                <span>
                    Enable news module
                <img src="{news_icon}" alt="news" class="inline h-6"/> 
                </span>
            </div>


            </SlideToggle>
            <Accordion>
                <AccordionItem open>
                    <svelte:fragment slot="summary"
                        >Global override 
                        
                        <span class="code">
                        {(_global_settings.override
                            ? true
                            : false)
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                            </svelte:fragment
                    >
                    <svelte:fragment slot="content">
                        <ul>
                            <li>
                                <SlideToggle
                                    bind:checked={slider_override}
                                    name="slider-large"
                                    active="bg-primary-500"
                                    size="sm"
                                >
                                <div>
                                    <span>
                                        Enable global override
                                    <img src="{globe_icon}" alt="globe" class="inline h-6"/> 
                                    </span>
                                </div>
                               
                                </SlideToggle>
                            </li>
                            <li>
                                <SlideToggle
                                    bind:checked={slider_ai}
                                    name="slider-large"
                                    active="bg-primary-500"
                                    size="sm"
                                >
                                <div>
                                    <span>
                                        Enable AI summary
                                    <img src="{ai_icon}" alt="ai" class="inline h-6"/> 
                                    </span>
                                </div>
                                   
                                </SlideToggle>
                            </li>
                            <li>
                                <SlideToggle
                                    bind:checked={slider_crawl}
                                    name="slider-large"
                                    active="bg-primary-500"
                                    size="sm"
                                >
                                <div>
                                    <span>
                                        Enable Crawler
                                    <img src="{literature_icon}" alt="literature" class="inline h-6"/> 
                                    </span>
                                </div>
                                </SlideToggle>
                            </li>
                        </ul>

                        <p class="k-sans">
                            The global override is intended to control the availability of the respected functionality and not necessarily the behaviour.
                            Configuration of the features is performed at guild level.
                        </p>
                    </svelte:fragment>
                </AccordionItem>
            </Accordion>
            
            <button class="btn variant-filled mt-4"
            on:click={() => updateContent()}>
            <div>
                <span>
                    Update bot with new configuration
                <img src="{sync_icon}" alt="sync" class="inline h-6"/> 
                </span>
            </div>
            
            </button>
        </div>
    {/if}
</div>
