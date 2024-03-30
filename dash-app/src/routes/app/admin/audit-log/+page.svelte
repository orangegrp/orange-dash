<script lang="ts">
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        Select,
        Skeleton,
        Snippet,
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
    let itemsPerPage = writable<number>(10);

    async function getAuditData() {
        console.log("fetched", pageNr, itemsPerPage);

        const result = await fetch("/api/admin/audit", {
            method: "GET",
            headers: {
                "X-Dash-SessionId": $page.data.session_id,
                "X-Dash-AuditPageNr": $pageNr.toString(),
                "X-Dash-AuditIPP": $itemsPerPage.toString(),
            },
        });

        if (result.status === 200) {
            let data_obj = await result.json();
            //data.set(data_obj.data as DashAuditEntry[]);
            $data = data_obj.data as DashAuditEntry[];
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
                return "text-green-700 dark:text-green-500";
            case "LoginFail":
                return "text-red-700 dark:text-red-500";
            case "Logout":
                return "text-blue-700 dark:text-blue-500";
            case "AccountDeletion":
            case "SecurityInfoChange":
                return "text-yellow-700 dark:text-yellow-500";
            case "Diagnostics":
            case "AuditAccess":
            default:
                return "text-black dark:text-white";
        }
    }
</script>

<div class="w-full">
    <Text type="h3" class="font-light mb-4">Audit Log</Text>
    <div class="mb-8 flex flex-row justify-between">
        <div class="flex flex-row place-items-center gap-x-2">
            <Text>Items per page:</Text>
            <Select
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
        </div>
    </div>

    <Table>
        <Row header>
            <Item header headerPos="left">Event</Item>
            <Item header headerPos="left">Time</Item>
            <Item header headerPos="left">User</Item>
            <Item header headerPos="left">Info</Item>
            <Item header headerPos="left">IP Address</Item>
            <Item header headerPos="left">Location</Item>
            <Item header headerPos="left">Device Info</Item>
        </Row>
        {#if $data}
            {#each $data as entry, index}
                <Row class="p-0">
                    <Item
                        class="text-sm flex flex-row gap-x-1 place-items-center dark:text-white-500 {getColorCodes(
                            entry.event,
                        )}"
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
                    <Item class="font-mono text-sm line-clamp-none"
                        >{entry.created}</Item
                    >
                    <Item
                        ><Text size="sm" blockquote
                            >{entry.dash_user.length < 1
                                ? "Anonymous"
                                : entry.dash_user}</Text
                        ></Item
                    >
                    <Item
                        style="max-width: calc(100% / 7) !important;"
                        class="text-xs font-mono {getColorCodes(
                            entry.event,
                        )} line-clamp-none">{entry.message}</Item
                    >
                    <Item class="font-mono text-sm">{entry.ip_address}</Item>
                    <Item class="text-sm">{entry.location}</Item>
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
</div>
