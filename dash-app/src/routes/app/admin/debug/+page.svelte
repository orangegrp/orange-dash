<script lang="ts">
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        Select,
        Skeleton,
        Option,
        Text,
        Button,
        Snippet,
        Note,
        Badge,
        Spacer,
    } from "geist-ui-svelte";

    import Table from "../../../components/table/Table.svelte";
    import Row from "../../../components/table/Row.svelte";
    import Item from "../../../components/table/Item.svelte";
    import { writable } from "svelte/store";
    import TextInput from "../../../components/TextInput.svelte";
    import type { DashDebugEntry } from "$lib/audit/debug";
    import ProcessDialogue from "../../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import ActionDialogue from "../../../components/dialogue/ActionDialogue.svelte";

    let userId = "";
    let userName = "";
    let loginMethods = [];
    let OAuth2_Id = "";
    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/admin/debug");

        const dashAccount = $page.data.dash_account as DashUser;

        userId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        OAuth2_Id = dashAccount.oauth2_id;
        accountType = dashAccount.role;

        getDebugData();
    });

    let data = writable<DashDebugEntry[]>(undefined);
    let pageNr = writable<number>(1);
    let maxPage = writable<number>(0);
    let itemsPerPage = writable<number>(10);
    let filterBy = writable<string>("*");

    async function getDebugData() {
        console.log("fetched", pageNr, itemsPerPage);

        const result = await fetch("/api/admin/debug", {
            method: "GET",
            headers: {
                "X-Dash-SessionId": $page.data.session_id,
                "X-Dash-PageNr": $pageNr.toString(),
                "X-Dash-IPP": $itemsPerPage.toString(),
                "X-Dash-Filter": $filterBy.toString(),
            },
        });

        if (result.status === 200) {
            let data_obj = await result.json();
            $data = data_obj.data as DashDebugEntry[];
            $maxPage = $data.length === 0 ? $pageNr : 0;
        }
    }

    function generateCsv() {
        let csv = "ErrorID,User,Trace";

        $data.forEach((entry) => {
            let nohtml = entry.trace.replace(/<style([\s\S]*?)<\/style>/gi, "");
            nohtml = nohtml.replace(/<script([\s\S]*?)<\/script>/gi, "");
            nohtml = nohtml.replace(/<\/div>/gi, "\n");
            nohtml = nohtml.replace(/<\/li>/gi, "\n");
            nohtml = nohtml.replace(/<li>/gi, "  *  ");
            nohtml = nohtml.replace(/<\/ul>/gi, "\n");
            nohtml = nohtml.replace(/<\/p>/gi, "\n");
            nohtml = nohtml.replace(/<br\s*[\/]?>/gi, "\n");
            nohtml = nohtml.replace(/<[^>]+>/gi, "");

            csv += `${entry.error_id},${entry.dash_user},${nohtml}\n`;
        });

        return csv;
    }

    function download(filename: string, text: string) {
        const blob = new Blob([text], { type: "text/csv" });
        if ((window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveBlob(blob, filename);
        } else {
            const elem = window.document.createElement("a");
            elem.href = window.URL.createObjectURL(blob);
            elem.style.display = "none";
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    let showPurgeMessage = false;
    let showProcessMessage = false;

    async function purgeAll() {
        return await fetch("/api/admin/debug", {
            method: "DELETE",
            headers: {
                "X-Dash-SessionId": $page.data.session_id
            },
        });
    }
</script>

<div class="w-full">
    <Text type="h3" class="font-light mb-4">Debug</Text>
    <div class="mb-8 flex flex-col lg:flex-row justify-between gap-y-4">
        <div class="flex flex-col sm:flex-row gap-x-4 gap-y-4">
            <div class="flex flex-row place-items-center gap-x-2 min-w-[100px]">
                <Text>Items per page:</Text>
                <Select
                    width="100px"
                    on:change={async (e) => {
                        $itemsPerPage = e.detail.value;
                        await getDebugData();
                    }}
                    bind:value={$itemsPerPage}
                >
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={30}>30</Option>
                    <Option value={50}>50</Option>
                </Select>
            </div>
            <div class="flex flex-row place-items-center gap-x-2 min-w-[300px]">
                <Text>Filter by error ID:</Text>
                <TextInput
                    oninput={async () => await getDebugData()}
                    bind:value={$filterBy}
                />
            </div>
        </div>
        <div class="flex flex-row place-items-center gap-x-2">
            <Text class="mr-2">
                Viewing page: {$pageNr}
            </Text>
            {#if $pageNr > 1}
                <Button
                    on:click={async () => {
                        $pageNr = $pageNr - 1;
                        await getDebugData();
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
                        await getDebugData();
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

    <Table>
        <Row header>
            <Item header headerPos="left" class="min-w-[100px] w-fit max-w-[175px]"
                >Error ID</Item
            >
            <Item header headerPos="left" class="min-w-[100px] w-fit max-w-[150px]">User</Item
            >
            <Item header headerPos="left" class="min-w-[100px]">Trace</Item>
        </Row>
        {#if $data}
            {#each $data as entry, index}
                <Row>
                    <Item
                        class="min-w-[100px] dark:!text-white font-mono text-xs line-clamp-none w-fit max-w-[175px]"
                        >{entry.error_id}</Item
                    >
                    <!--
                        <Text size="xs" blockquote
                            >{entry.dash_user.length < 1
                                ? "Anonymous"
                                : entry.dash_user}</Text
                        >
                    -->
                    <Item
                        class="min-w-[150px] max-w-[200px] flex flex-col gap-y-1 place-items-start line-clamp-1"
                    >
                        {#if entry.dash_user.toString() === userId}
                            <Badge color="success" ghost size="xs"
                                ><div class="py-1">Current user</div></Badge
                            >
                        {:else if entry.dash_user.toString().length < 1}
                            <Badge color="default" ghost size="xs"
                                ><div class="py-1">Anonymous</div>
                            </Badge>
                        {:else}
                            <button
                                on:click={() => {
                                    window.navigator.clipboard.writeText(
                                        entry.dash_user.toString(),
                                    );
                                }}
                                id="item-user-{index}"
                                class="flex flex-row gap-x-2 place-items-center line-clamp-1 dark:!text-gray-300 font-weight-inherit text-inherit dark:text-inherit !text-xs inherit bg-gray-50 border-gray-100 dark:bg-gray-950 hover:dark:bg-gray-900 active:dark:bg-gray-800 dark:border-gray-900 border pl-2 pr-1 py-1 rounded-md"
                            >
                                <Text size="xs"
                                    >{entry.dash_user.toString().length < 1
                                        ? "Anonymous"
                                        : entry.dash_user}</Text
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
                                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                                    />
                                </svg>
                            </button>
                        {/if}
                    </Item>
                    <Item class="min-w-[100px] w-fit overflow-auto mr-8 font-mono text-xs">
                        <pre class="line-clamp-none" style="line-height: 100% !important;">
                            {@html entry.trace.trim()}
                        </pre>
                    </Item>
                </Row>
            {/each}
        {:else}
            {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as loader}
                <Row>
                    <Item>
                        <Skeleton class="w-full h-8 rounded-md" />
                    </Item>
                </Row>
            {/each}
        {/if}
    </Table>

    <Button
        class="float-right mt-8"
        size="sm"
        on:click={() =>
            download(`debug-${Date.now()}-page-${$pageNr}.csv`, generateCsv())}
    >
        <div class="flex flex-row gap-x-2 place-items-center">
            Export to CSV
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
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
        </div>
    </Button>
    {#if accountType === "Root"}
    <ActionDialogue
        bind:show={showPurgeMessage}
        title="Purge all debug data?"
        actionBtnColor="error"
        actionButtonText="Purge All"
        buttonText="Do not purge"
        message="All debug events matched by the filter (including those not on this page) will be deleted."
        action={async () => {
            showProcessMessage = true;
            await purgeAll();
            showProcessMessage = false;
            window.location.reload();
        }}
    />
    <Button
        class="float-right mr-2 mt-8"
        color="error"
        size="sm"
        on:click={() => (showPurgeMessage = true)}
    >
        Purge All
    </Button>
{/if}
</div>

<ProcessDialogue
    bind:show={showProcessMessage}
    message="Purging debug data"
>
    <Text size="sm" color="secondary">This can take a few minutes. <Text color="dark" b>Do not reload the page.</Text></Text>
    <Spacer h={15} />
    <Spinner />
</ProcessDialogue>
