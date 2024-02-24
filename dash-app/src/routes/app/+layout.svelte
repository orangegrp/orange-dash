<script lang="ts">
    import { onMount } from "svelte";
    import { Tabs, TabItem } from "geist-ui-svelte";
    import { page } from "$app/stores";

    import Overview from "./overview/+page.svelte";
    import Deployment from "./deployment/+page.svelte";
    import Modules from "./modules/+page.svelte";
    import Database from "./database/+page.svelte";
    import DashAccount from "./account/+page.svelte";
    import { writable } from "svelte/store";

    let currentPageIndex = writable<number>(-1);

    switch($page.url.pathname) {
        case "/app/deployment":
            $currentPageIndex = 1;
            break;
        case "/app/modules":
            $currentPageIndex = 2;
            break;
        case "/app/database":
            $currentPageIndex = 3;
            break;
        case "/app/account":
            $currentPageIndex = 4;
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

    onMount(() => {
        removeDuplicateBorder();
    });
</script>

<main>
    <div class="flex place-items-center justify-center sticky top-0 backdrop-blur-lg dark:bg-black/80 bg-gray-50/80">
		<div class="w-full flex-grow px-2 sm:px-8 md:px-24 lg:px-32 border-b dark:border-b-gray-900 border-b-gray-100">
            <div id="header-borderless-parent">
                <Tabs border={true}>
                    <TabItem initialSelected={$page.url.pathname === "/app" || $page.url.pathname === "/app/overview"} on:clicked={() => $currentPageIndex = 0}>Overview</TabItem>
                    <TabItem initialSelected={$page.url.pathname === "/app/deployment"} on:clicked={() => $currentPageIndex = 1}>Deployment</TabItem>
                    <TabItem initialSelected={$page.url.pathname === "/app/modules"} on:clicked={() => $currentPageIndex = 2}>Modules</TabItem>
                    <TabItem initialSelected={$page.url.pathname === "/app/database"} on:clicked={() => $currentPageIndex = 3}>Database</TabItem>
                    <TabItem initialSelected={$page.url.pathname === "/app/account"} on:clicked={() => $currentPageIndex = 4}>Dash Account</TabItem>
                </Tabs>
            </div>
		</div>
	</div>

    <svelte:component this={[Overview, Deployment, Modules, Database, DashAccount][$currentPageIndex < 0 || $currentPageIndex > 4 ? 0 : $currentPageIndex]} />
</main>