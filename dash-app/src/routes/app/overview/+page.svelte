<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import Table from "../../components/table/Table.svelte";
    import Row from "../../components/table/Row.svelte";
    import Item from "../../components/table/Item.svelte";
    import {
        RadioTabs,
        RadioTab,
        Dot,
        Text,
        Card,
        Details,
        Center,
        Button,
        ToolTip,
        Loading,
        Select,
        Option,
    } from "geist-ui-svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";
    import type { DashServiceLogEntry } from "$lib/audit/logs";

    onMount(() => {
        window.history.replaceState({}, "", "/app/overview");

        getLogData();

        setInterval(() => getLogData(), 10000);
    });

    const colors = ["#00ff66", "#ffaa00", "#ff4444", "#0099ff"];
    const messages = [
        "All systems operational",
        "Degraded service - possible issues",
        "Major service outage - all systems down",
        "Information unavailable",
    ];
    let statusCode = 3;

    let showLogs = false;
    let bufferingLogs = false;

    let logs = writable<DashServiceLogEntry[]>(undefined);
    let pageNr = writable<number>(1);
    let maxPage = writable<number>(0);
    let itemsPerPage = writable<number>(100);
    let filterBy = writable<string>("*");

    async function getLogData() {
        bufferingLogs = true;

        const result = await fetch("/api/admin/overview/logs", {
            method: "GET",
            headers: {
                "X-Dash-SessionId": $page.data.session_id,
                "X-Dash-PageNr": $pageNr.toString(),
                "X-Dash-IPP": $itemsPerPage.toString(),
                "X-Dash-Filter": $filterBy.toString(),
            },
        });

        function sleep(time: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, time);
            });
        }

        if (result.status === 200) {
            let data_obj = await result.json();
            $logs = data_obj.data.items as DashServiceLogEntry[];
            $maxPage = $logs.length === 0 ? $pageNr : 0;

            await sleep(3000);
            bufferingLogs = false;
        }
    }
</script>

<main>
    <AppHeader Title="">
        <svelte:fragment slot="header">
            <div class="flex flex-row gap-x-8">
                <div class="flex flex-col gap-y-1">
                    <Text size="sm" color="secondary" class="!font-medium"
                        >Status</Text
                    >
                    <div class="flex flex-row place-items-center gap-x-2">
                        <span class="flex animate-pulse">
                            <Dot size={8} color={colors[statusCode]} />
                        </span>
                        <Text size="sm" class="!font-normal"
                            >{messages[statusCode]}</Text
                        >
                    </div>
                </div>
            </div>
        </svelte:fragment>
    </AppHeader>
    <AppContent>
        <svelte:fragment slot="content">
            <div class="my-4 w-full max-w-full md:max-w-full md:w-full">
                <Center>
                    <Text
                        class="min-w-[400px] w-3/4 max-w-full md:max-w-screen-lg lg:max-w-screen-xl my-8"
                        size="2xl"
                        b>System Overview</Text
                    >
                    <Card
                        class="!p-0 min-w-[400px] w-3/4 max-w-full md:max-w-screen-lg lg:max-w-screen-xl"
                    >
                        <div class="p-6">
                            <button
                                on:click={() => (showLogs = !showLogs)}
                                type="button"
                                class="w-full flex place-items-center gap-2 text-md text-gray-600 dark:text-white"
                                ><div
                                    class="transition-all flex place-items-center justify-center"
                                >
                                    <svg
                                        aria-label="arrow"
                                        style="transform: rotate({showLogs
                                            ? 90
                                            : 0}deg); display: inline;"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        ><path
                                            d="M9 18l6-6-6-6"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        ></path></svg
                                    >
                                </div>
                                Service Logs
                            </button>
                        </div>
                        {#if showLogs}
                            <div
                                class="px-4 py-2 mb-4 flex flex-row justify-between"
                            >
                                <div
                                    class="flex flex-col lg:flex-row gap-y-2 gap-x-4"
                                >
                                    <RadioTabs size="sm">
                                        <RadioTab
                                            on:selected={() => {
                                                $filterBy = "*";
                                                getLogData();
                                            }}>All Logs</RadioTab
                                        >
                                        <RadioTab
                                            on:selected={() => {
                                                $filterBy = "Error";
                                                getLogData();
                                            }}
                                        >
                                            <div
                                                class="flex flex-row place-items-center gap-x-1"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-5 h-5"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                                    />
                                                </svg>

                                                Errors
                                            </div></RadioTab
                                        >
                                        <RadioTab
                                            on:selected={() => {
                                                $filterBy = "Warning";
                                                getLogData();
                                            }}
                                        >
                                            <div
                                                class="flex flex-row place-items-center gap-x-1"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-5 h-5"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                                    />
                                                </svg>
                                                Warnings
                                            </div>
                                        </RadioTab>
                                    </RadioTabs>
                                    <div
                                        class="flex flex-row place-items-center gap-x-2 min-w-[100px]"
                                    >
                                        <Text size="sm">Max lines:</Text>
                                        <Select
                                            width="100px"
                                            on:change={async (e) => {
                                                $itemsPerPage = e.detail.value;
                                                await getLogData();
                                            }}
                                            bind:value={$itemsPerPage}
                                        >
                                            <Option value={50}>50</Option>
                                            <Option value={100}>100</Option>
                                            <Option value={150}>150</Option>
                                            <Option value={200}>200</Option>
                                        </Select>
                                    </div>
                                    <div
                                        class="flex flex-row place-items-center gap-x-2"
                                    >
                                        <Text class="mr-2" size="sm">
                                            Viewing page: {$pageNr}
                                        </Text>
                                        {#if $pageNr > 1}
                                            <Button
                                                on:click={async () => {
                                                    $pageNr = $pageNr - 1;
                                                    await getLogData();
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-4 h-4"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                                    />
                                                </svg>
                                            </Button>
                                        {/if}
                                        {#if $maxPage === 0 || $pageNr < $maxPage}
                                            <Button
                                                on:click={async () => {
                                                    $pageNr = $pageNr + 1;
                                                    await getLogData();
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-4 h-4"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                                                    />
                                                </svg>
                                            </Button>
                                        {/if}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    id="copy-logs"
                                    on:click={() => {
                                        const text = [];
                                        $logs.forEach((l) =>
                                            text.push(
                                                `${l.host} ${l.created} ${l.details}`,
                                            ),
                                        );
                                        let nohtml = text.join("\n").replace(/<style([\s\S]*?)<\/style>/gi, "");
                                        nohtml = nohtml.replace(/<script([\s\S]*?)<\/script>/gi, "");
                                        nohtml = nohtml.replace(/<\/div>/gi, "\n");
                                        nohtml = nohtml.replace(/<\/li>/gi, "\n");
                                        nohtml = nohtml.replace(/<li>/gi, "  *  ");
                                        nohtml = nohtml.replace(/<\/ul>/gi, "\n");
                                        nohtml = nohtml.replace(/<\/p>/gi, "\n");
                                        nohtml = nohtml.replace(/<br\s*[\/]?>/gi, "\n");
                                        nohtml = nohtml.replace(/<[^>]+>/gi, "");
                                        window.navigator.clipboard.writeText(
                                            nohtml
                                        );
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-4 h-4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                                        />
                                    </svg>
                                </Button>
                                <ToolTip
                                    content="Copy to clipboard"
                                    anchor="#copy-logs"
                                    placement="left"
                                />
                            </div>
                            <div class="bg-gray-975">
                                <Table>
                                    {#each $logs as log}
                                        <Row
                                            class="border-none font-mono !m-0 !p-0 overflow-x-auto"
                                        >
                                            <Item
                                                id="log-item-{log.id}"
                                                class="!text-white text-sm flex flex-row place-items-center justify-between"
                                            >
                                                <div>
                                                    <span class="text-cyan-600"
                                                        >{log.host}</span
                                                    >&nbsp;
                                                    <!--
                                                                                                            <Text color="secondary"
                                                        >{log.created}</Text
                                                    >&nbsp;&nbsp;
                                                    -->
                                                    {@html log.details.trim()}&nbsp;
                                                </div>
                                                <div>
                                                    {#if log.level === "Error"}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke={colors[2]}
                                                            class="w-5 h-5"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                                            />
                                                        </svg>
                                                    {/if}
                                                    {#if log.level === "Warning"}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke={colors[1]}
                                                            class="w-5 h-5"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                                            />
                                                        </svg>
                                                    {/if}
                                                    {#if log.level === "Log"}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke={colors[3]}
                                                            class="w-5 h-5"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                                            />
                                                        </svg>
                                                    {/if}
                                                    {#if log.level === "Verbose"}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke={colors[4]}
                                                            class="w-5 h-5"
                                                        >
                                                            &nbsp;
                                                        </svg>
                                                    {/if}
                                                </div>
                                            </Item>
                                            <ToolTip
                                                anchor="#log-item-{log.id}"
                                                placement="bottom-end"
                                                content={log.created}
                                            />
                                        </Row>
                                    {/each}
                                </Table>
                                {#if bufferingLogs}
                                    <div class="p-4">
                                        <Center>
                                            <Loading size="md" />
                                        </Center>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </Card>
                </Center>
            </div>
        </svelte:fragment>
    </AppContent>
</main>
