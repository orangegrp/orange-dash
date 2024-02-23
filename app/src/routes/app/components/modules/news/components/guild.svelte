<script lang="ts">
    import { onMount } from "svelte";
    import {
        getGuildSettings,
        getSettings,
        getSource,
        setGuildSettings,
        setSettings,
    } from "../newsapi";
    import type { NewsConfig, NewsGuildConfig, NewsSource } from "$lib/news";
    import { ListBox, ListBoxItem, ProgressRadial, SlideToggle, popup } from "@skeletonlabs/skeleton";
    import { Autocomplete } from "@skeletonlabs/skeleton";
    import type {
        AutocompleteOption,
        PopupSettings,
    } from "@skeletonlabs/skeleton";
    import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

    import ai_icon from "$lib/images/ai-icon.png";
    import globe_icon from "$lib/images/globe-icon.png";
    import literature_icon from "$lib/images/literature-icon.png";
    import news_icon from "$lib/images/news-icon.png";
    import sync_icon from "$lib/images/sync-icon.png";

    import { getToastStore } from "@skeletonlabs/skeleton";
    import { writable } from "svelte/store";

    const toastStore = getToastStore();

    export var slider_enabled: boolean = false;
    export var slider_override: boolean = false;
    export var slider_crawl: boolean = false;
    export var slider_ai: boolean = false;
    export var channel_id: string = "";

    export var srcCfg: NewsSource | undefined = undefined;

    var api_key: string | null = null;
    var _settings: NewsGuildConfig | undefined = undefined;
    //var _sources: NewsSource[] | undefined = undefined;
    
    var currentGuild: string | undefined = undefined;
    var currentSource: string | undefined = undefined;

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom",
    };

    let popupSettings2: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete2",
        placement: "bottom",
    };

    const popupCombobox: PopupSettings = {
        event: 'click',
        target: 'popupCombobox',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    };

    let serverOptions = writable<AutocompleteOption<string>[]>([]);
    let sourceOptions = writable<AutocompleteOption<string>[]>([]);

    let serverInput: string = "";
    let srcInput: string = "";

    async function loadSource() {
        api_key = localStorage.getItem("orange-dash-api-key");

        if (!api_key) {
            return;
        }

        try {
            let source = await getSource(api_key, currentGuild!, currentSource!);

            srcCfg = {
                ...source
            };

            toastStore.trigger({
                message: `Source loaded`,
                background: "variant-filled-success",
            });

        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to load source: ${err.message}`,
                background: "variant-filled-error",
            })
        }
    }

    async function getSources() {
        api_key = localStorage.getItem("orange-dash-api-key");

        if (!api_key) {
            return;
        }

        try {
            const data = ((await getGuildSettings(
                    api_key,
                    currentGuild!
                )) as NewsGuildConfig).sources;

            
            data.forEach((source) => {
                if (
                    !$sourceOptions ||
                    !$sourceOptions.find((s) => s.value === source.id)
                )
                    $sourceOptions.push({
                        value: source.id,
                        label: source.name
                    });
            });
        
        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to load sources: ${err.message}`,
                background: "variant-filled-error",
            });
        }
    }

    async function getGuilds(): Promise<
        { keys: string[]; values: object } | undefined
    > {
        api_key = localStorage.getItem("orange-dash-api-key");

        try {
            if (!api_key) return;

            const data = ((await getSettings(api_key)).data as NewsConfig)
                .guilds;

            Object.keys(data).forEach((key) => {
                if (
                    !$serverOptions ||
                    !$serverOptions.find((s) => s.value === key)
                )
                    $serverOptions.push({
                        value: key,
                        label: key,
                    });
            });

            return { keys: Object.keys(data), values: Object.values(data) };
        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to load guild settings: ${err.message}`,
                background: "variant-filled-error",
            });
        }
    }

    async function updateContent() {
        api_key = localStorage.getItem("orange-dash-api-key");

        try {
            _settings = undefined;

            const newData: Omit<NewsGuildConfig, "sources"> = {
                channel_id: channel_id,
                enabled: slider_enabled,
                override: slider_override
                    ? {
                          crawl: slider_crawl,
                          aiSummary: slider_ai,
                      }
                    : undefined,
            };

            if (api_key) {
                await setGuildSettings(api_key, currentGuild!, newData);

                toastStore.trigger({
                    message: `Guild settings updated`,
                    background: "variant-filled-success",
                });

                loadContent();
            }
        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to update guild settings: ${err.message}`,
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
            _settings = await getGuildSettings(api_key, currentGuild!);

            channel_id = _settings.channel_id;
            slider_enabled = _settings.enabled;
            slider_override = _settings.override ? true : false;
            slider_crawl = _settings.override?.crawl ?? false;
            slider_ai = _settings.override?.aiSummary ?? false;

            
            await getSources();


            toastStore.trigger({
                message: `Guild settings loaded`,
                background: "variant-filled-success",
            });


            setTimeout(() => {
                toastStore.trigger({
                    message: `Refreshing guild settings`,
                    background: "variant-filled",
                });
                loadContent();
            }, 3000000);
        } catch (err: any) {
            console.error(err);
            toastStore.trigger({
                message: `Failed to load guild settings: ${err.message}`,
                background: "variant-filled-error",
            });

            setTimeout(() => {
                toastStore.trigger({
                    message: `Loading guild settings`,
                    background: "variant-filled",
                });
                loadContent();
            }, 10000);
        }
    }

    onMount(async () => {
        console.log(await getGuilds());
    
    });
</script>

<div class="max-w-prose">
    <div class="card p-6 pr-12 shadow-2xl pb-12 w-full">
        <h3 class="h3 k-bold mb-4 mt-2">Guild settings</h3>
        <label class="label">
            <span>Guild ID</span>
            <div class="flex flex-row space-x-2">
                <input
                    class="input"
                    type="text"
                    bind:value={serverInput}
                    use:popup={popupSettings}
                />
                <button class="btn bg-surface-backdrop-token">
                    Add guild
                </button>
                <div
                    data-popup="popupAutocomplete"
                    class="card bg-surface-backdrop-token p-2 rounded-xl shadow-xl"
                >
                    <Autocomplete
                        bind:input={serverInput}
                        options={$serverOptions}
                        on:selection={(e) => {
                            serverInput = e.detail.value;
                            currentGuild = serverInput;
                            loadContent();
                        }}
                    />
                </div>
            </div>
        </label>

        {#if currentGuild}
            {#if !_settings}
                <ProgressRadial />
            {:else}
                <main>
                    <h4 class="h4 k-bold mb-4 mt-8">Configuration</h4>

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
                                <img
                                    src={news_icon}
                                    alt="news"
                                    class="inline h-6"
                                />
                            </span>
                        </div>
                    </SlideToggle>

                    <div class="flex flex-row mb-4 mt-2">
                        <p class="mr-8 w-1/3">Specify <span class="code">channel_id</span></p>
                        <input class="input inline h-6" type="text" bind:value={channel_id}/>
                    </div>

                    <Accordion>
                        <AccordionItem open>
                            <svelte:fragment slot="summary"
                                >Override

                                <span class="code">
                                    {(_settings.override ? true : false)
                                        ? "Enabled"
                                        : "Disabled"}
                                </span>
                            </svelte:fragment>
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
                                                    Enable override
                                                    <img
                                                        src={globe_icon}
                                                        alt="globe"
                                                        class="inline h-6"
                                                    />
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
                                                    <img
                                                        src={ai_icon}
                                                        alt="ai"
                                                        class="inline h-6"
                                                    />
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
                                                    <img
                                                        src={literature_icon}
                                                        alt="literature"
                                                        class="inline h-6"
                                                    />
                                                </span>
                                            </div>
                                        </SlideToggle>
                                    </li>
                                </ul>
                            </svelte:fragment>
                        </AccordionItem>
                    </Accordion>

                    <button
                        class="btn bg-surface-backdrop-token mt-4"
                        on:click={() => updateContent()}
                    >
                        <div>
                            <span>
                                Update bot with new configuration
                                <img
                                    src={sync_icon}
                                    alt="sync"
                                    class="inline h-6"
                                />
                            </span>
                        </div>
                    </button>
                </main>

                <main>
                    <h4 class="h4 k-bold mb-4 mt-8">Sources</h4>

                    <label class="label">
                        <span>Source name</span>
                        <div class="flex flex-row space-x-2">
                            <input
                                class="input"
                                type="text"
                                bind:value={srcInput}
                                use:popup={popupSettings2}
                            />
                            <button class="btn bg-surface-backdrop-token">
                                Add source
                            </button>
                            <div
                                data-popup="popupAutocomplete2"
                                class="card bg-surface-backdrop-token p-2 rounded-xl shadow-xl"
                            >
                                <Autocomplete
                                    bind:input={srcInput}
                                    options={$sourceOptions}
                                    on:selection={(e) => {
                                        srcInput = e.detail.label;
                                        currentSource = e.detail.value;
                                        loadSource();
                                    }}
                                />
                            </div>
                        </div>
                    </label>

                    {#if currentSource}
                        {#if !srcCfg}
                        <ProgressRadial />
                        {:else}
                        <h4 class="h4 k-bold mb-4 mt-8">Configuration</h4>
                        <div>
                            <div class="flex flex-row mb-4 mt-2">
                                <p class="mr-8 w-1/3">Publisher icon url</p>
                                <input class="input inline h-6" type="text" bind:value={srcCfg.icon}/>
                            </div>
                            
                            <div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
                                <ListBox rounded="rounded-none">
                                    <ListBoxItem bind:group={srcCfg.feedType} name="medium" value="RSS">RSS</ListBoxItem>
                                    <ListBoxItem bind:group={srcCfg.feedType} name="medium" value="Atom">Atom</ListBoxItem>
                                    <ListBoxItem bind:group={srcCfg.feedType} name="medium" value="JSON">JSON</ListBoxItem>
                                    <ListBoxItem bind:group={srcCfg.feedType} name="medium" value="YouTube">YouTube</ListBoxItem>
                                    <ListBoxItem bind:group={srcCfg.feedType} name="medium" value="Telegram">Telegram</ListBoxItem>
                                </ListBox>
                                <div class="arrow bg-surface-100-800-token" />
                            </div>
                                                
                        </div>
                        {/if}
                    {/if}   
                </main>
               
            {/if}
        {/if}
    </div>
</div>
