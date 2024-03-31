<script lang="ts">
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        Select,
        Skeleton,
        Note,
        Option,
        Text,
        ToolTip,
        Button,
    } from "geist-ui-svelte";
    import type { DashAuditEntry, DashAuditEvent } from "$lib/audit/audit";

    import Table from "../../../components/table/Table.svelte";
    import Row from "../../../components/table/Row.svelte";
    import Item from "../../../components/table/Item.svelte";
    import { writable } from "svelte/store";

    let userId = "";
    let userName = "";
    let loginMethods = [];
    let OAuth2_Id = "";
    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/admin/audit-log");

        const dashAccount = $page.data.dash_account as DashUser;

        userId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        OAuth2_Id = dashAccount.oauth2_id;
        accountType = dashAccount.role;

        getAuditData();
    });

    let data = writable<DashAuditEntry[]>(undefined);
    let pageNr = writable<number>(1);
    let maxPage = writable<number>(0);
    let itemsPerPage = writable<number>(10);
    let filterBy = writable<string>("*");

    async function getAuditData() {
        console.log("fetched", pageNr, itemsPerPage);

        const result = await fetch("/api/admin/audit", {
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
            //data.set(data_obj.data as DashAuditEntry[]);
            $data = data_obj.data as DashAuditEntry[];
            $maxPage = $data.length === 0 ? $pageNr : 0;
        }
    }

    function getFriendlyEventName(event: DashAuditEvent) {
        switch (event) {
            case "AccountCreation":
                return "Account Creation";
            case "LoginOK":
                return "Successful Login";
            case "LoginFail":
                return "Failed Login";
            case "Logout":
                return "Account Logout";
            case "AccountDeletion":
                return "Account Deletion";
            case "SecurityInfoChange":
                return "Security Info Edit";
            case "Diagnostics":
                return "Diagnostics";
            case "AuditAccess":
                return "Audit Log Viewed";
            default:
                return "Unknown Event";
        }
    }

    function getColorCodes(event: DashAuditEvent) {
        switch (event) {
            case "AccountCreation":
            case "LoginOK":
                return "!text-green-700 dark:!text-green-500";
            case "LoginFail":
                return "!text-red-700 dark:!text-red-500";
            case "Logout":
                return "!text-blue-700 dark:!text-blue-500";
            case "AccountDeletion":
            case "SecurityInfoChange":
                return "!text-yellow-700 dark:!text-yellow-500";
            case "Diagnostics":
            case "AuditAccess":
            default:
                return "!text-black dark:!text-white";
        }
    }

    function generateCsv() {
        let csv = "Event,Time,User,Info,IP Address,Location,Device Info\n";

        $data.forEach((entry) => {
            csv += `${entry.event},${entry.created},${entry.dash_user},${entry.message},${entry.ip_address},${entry.location},${entry.device}\n`;
        });

        return csv;
    }

    function download(filename, text) {
        const element = document.createElement("a");
        element.style.visibility = "hidden";
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text),
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
</script>

<div class="w-full">
    <Text type="h3" class="font-light mb-4">Audit Log</Text>
    <div class="mb-8 flex flex-col lg:flex-row justify-between gap-y-4">
        <div class="flex flex-col sm:flex-row gap-x-4 gap-y-4">
            <div class="flex flex-row place-items-center gap-x-2 min-w-[100px]">
                <Text>Items per page:</Text>
                <Select
                    width="100px"
                    on:change={async (e) => {
                        $itemsPerPage = e.detail.value;
                        await getAuditData();
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
                <Text>Filter by event:</Text>
                <Select
                    width="225px"
                    on:change={async (e) => {
                        $filterBy = e.detail.value;
                        await getAuditData();
                    }}
                    bind:value={$filterBy}
                >
                    <Option value="*">All Events</Option>
                    <Option value="AccountCreation">Account Creation</Option>
                    <Option value="LoginOK">Successful Login</Option>
                    <Option value="LoginFail">Failed Login</Option>
                    <Option value="Logout">Account Logout</Option>
                    <Option value="AccountDeletion">Account Deletion</Option>
                    <Option value="SecurityInfoChange"
                        >Security Info Edit</Option
                    >
                    <Option value="Diagnostics">Diagnostics</Option>
                    <Option value="AuditAccess">Audit Log Viewed</Option>
                </Select>
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
                        await getAuditData();
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
                        await getAuditData();
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
            <Item header headerPos="left" class="max-w-[175px]">Event</Item>
            <Item header headerPos="left" class="max-w-[120px]">Time</Item>
            <Item header headerPos="left" class="max-w-[150px]">User</Item>
            <Item header headerPos="left" class="">Info</Item>
            <Item header headerPos="left" class="max-w-[100px]">IP Address</Item>
            <Item header headerPos="left" class="max-w-[200px]">Location</Item>
            <Item header headerPos="left" class="">Device Info</Item>
        </Row>
        {#if $data}
            {#each $data as entry, index}
                <Row class="p-0">
                    <Item
                        class="max-w-[175px] text-sm flex flex-row gap-x-1 place-items-center {getColorCodes(
                            entry.event,
                        )} "
                    >
                        {getFriendlyEventName(entry.event)}
                        <div>
                            {#if entry.event === "LoginOK" || entry.event === "Logout"}
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
                                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                    />
                                </svg>
                            {:else if entry.event === "LoginFail"}
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
                                        d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                                    />
                                </svg>
                            {:else if entry.event === "SecurityInfoChange" || entry.event === "AccountDeletion"}
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
                            {:else}
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
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                            {/if}
                        </div>
                    </Item>
                    <Item class="font-mono text-xs line-clamp-none max-w-[120px]"
                        >{entry.created}</Item
                    >
                    <Item
                        class="max-w-[150px]"
                        ><Text size="sm" blockquote
                            >{entry.dash_user.length < 1
                                ? "Anonymous"
                                : entry.dash_user}</Text
                        ></Item
                    >
                    <Item
                        id="item-info-{index}"
                        class="text-xs font-mono {getColorCodes(
                            entry.event,
                        )} line-clamp-2">{entry.message}</Item
                    >
                    <ToolTip
                        anchor="#item-info-{index}"
                        content={entry.message}
                    />
                    <Item class="font-mono text-sm max-w-[100px]">{entry.ip_address}</Item>
                    <Item id="item-loc-{index}" class="text-xs line-clamp-2 max-w-[200px]"
                        >{entry.location}</Item
                    >
                    <ToolTip
                        anchor="#item-loc-{index}"
                        content={entry.location}
                    />
                    <Item
                        id="item-device-{index}"
                        class="text-xs line-clamp-2 font-mono"
                    >
                        {entry.device ?? "Unknown"}
                    </Item>
                    <ToolTip
                        anchor="#item-device-{index}"
                        content={entry.device ?? "Unknown"}
                    />
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
            download(
                `audit-log-${Date.now()}-page-${$pageNr}.csv`,
                generateCsv(),
            )}
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
</div>