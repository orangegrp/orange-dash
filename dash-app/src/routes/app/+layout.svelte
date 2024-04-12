<script lang="ts">
    import { onMount } from "svelte";
    import { Tabs, TabItem, Text, Button } from "geist-ui-svelte";
    import { page } from "$app/stores";

    import Overview from "./overview/+page.svelte";
    import Deployment from "./deployment/+page.svelte";
    import Modules from "./modules/+page.svelte";
    import Database from "./database/+page.svelte";
    import DashAccount from "./account/+page.svelte";
    import NotBot from "./notbot/+page.svelte";
    import Admin from "./admin/+page.svelte";
    import StudyBot from "./studybot/+page.svelte";

    import { writable } from "svelte/store";
    import type { DashUser } from "$lib/auth/dash";
    import { goto } from "$app/navigation";

    let currentPageIndex = writable<number>(-1);

    switch ($page.url.pathname) {
        case "/app/deployment":
            $currentPageIndex = 1;
            break;
        case "/app/modules":
            $currentPageIndex = 2;
            break;
        case "/app/database":
            $currentPageIndex = 3;
            break;
        case "/app/account/general":
        case "/app/account/security":
        case "/app/account/danger-zone":
        case "/app/account":
            $currentPageIndex = 4;
            break;
        case "/app/notbot":
            $currentPageIndex = 5;
            break;
        case "/app/admin/debug":
        case "/app/admin/audit-log":
        case "/app/admin/user-accounts":
        case "/app/admin":
            $currentPageIndex = 6;
            break;
        case "/app/studybot":
        case "/app/studybot/questions":
        case "/app/studybot/studycontent":
            $currentPageIndex = 7;
            break;
        case "/app":
        case "/app/overview":
        default:
            $currentPageIndex = 0;
            break;
    }

    // hack workaround to remove the border and use my own
    // because the ui component does not allow for the border to be removed without the underline.
    function removeDuplicateBorder() {
        const parent = document.getElementById("header-borderless-parent");

        parent.style.border = "none";
        const children = parent.childNodes;

        for (const child of children) {
            if (child.nodeName === "DIV") {
                const element = child as HTMLElement;
                element.style.border = "none";
                element.setAttribute("data-border", "false");
                element.dataset.border = "false";
            }
        }
    }

    let titles = [
        "Overview",
        "Deployment",
        "Modules",
        "Database",
        "Account Manager",
        "NotBot™",
        "Admin",
    ];
    let accountType = "";
    let abac_str = "";

    onMount(() => {
        removeDuplicateBorder();

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
        abac_str = dashAccount.abac_str;
    });
</script>

<svelte:head>
    <title>{titles[$currentPageIndex] ?? "Dash"}</title>
</svelte:head>

<div>
    <div
        class="{$currentPageIndex === 4
            ? 'hidden'
            : ''} flex flex-col sticky top-0 backdrop-blur-lg dark:bg-gray-975/80 bg-gray-50/80"
    >
        {#if accountType === "Root"}
            <div
                class="px-2 md:px-5 flex flex-row gap-x-2 my-1 place-items-center"
            >
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
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                </svg>
                You are logged in as a superuser. Be careful.
                <Button
                    color="success-light"
                    size="xs"
                    on:click={() => goto("/logout")}
                >
                    Log Out
                </Button>
            </div>
        {/if}
        <div
            class="w-full flex-grow px-2 md:px-5 border-b dark:border-b-gray-900 border-b-gray-100"
        >
            <div id="header-borderless-parent" data-sveltekit-reload>
                <Tabs border={true}>
                    <TabItem
                        initialSelected={$currentPageIndex == 0}
                        on:clicked={() => ($currentPageIndex = 0)}
                    >
                        Overview</TabItem
                    >
                    {#if accountType === "Admin" || accountType === "Root"}
                        <TabItem
                            initialSelected={$currentPageIndex == 1}
                            on:clicked={() => ($currentPageIndex = 1)}
                        >
                            Deployment</TabItem
                        >
                    {/if}
                    <TabItem
                        initialSelected={$currentPageIndex == 2}
                        on:clicked={() => ($currentPageIndex = 2)}
                    >
                        Modules</TabItem
                    >
                    {#if accountType === "Admin" || accountType === "Root"}
                        <TabItem
                            initialSelected={$currentPageIndex == 3}
                            on:clicked={() => ($currentPageIndex = 3)}
                        >
                            Database</TabItem
                        >
                        <TabItem
                            initialSelected={$currentPageIndex == 5}
                            on:clicked={() => ($currentPageIndex = 5)}
                        >
                            NotBot™</TabItem
                        >
                        <TabItem
                            initialSelected={$currentPageIndex == 6}
                            on:clicked={() => ($currentPageIndex = 6)}
                        >
                            Admin Area</TabItem
                        >
                    {/if}
                    {#if abac_str.includes("studybot")}
                        <TabItem
                            initialSelected={$currentPageIndex == 7}
                            on:clicked={() => ($currentPageIndex = 7)}
                        >
                            StudyBot™</TabItem
                        >
                    {/if}
                    <!--
                    <TabItem
                        initialSelected={$currentPageIndex == 4}
                        on:clicked={() => ($currentPageIndex = 4)}
                    >
                        Dash&nbsp;Account</TabItem
                    >
                    -->
                </Tabs>
            </div>
        </div>
    </div>

    {#key $currentPageIndex}
        <svelte:component
            this={[
                Overview,
                Deployment,
                Modules,
                Database,
                DashAccount,
                NotBot,
                Admin,
                StudyBot,
            ][
                $currentPageIndex < 0 || $currentPageIndex > 7
                    ? 0
                    : $currentPageIndex
            ]}
        />
    {/key}
</div>
