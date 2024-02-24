<script lang="ts">
    import { onMount } from "svelte";
    import { Tabs, TabItem, Spacer } from "geist-ui-svelte";
    import { page } from "$app/stores";

    import Overview from "./overview/+page.svelte";
    import Deployment from "./deployment/+page.svelte";
    import Modules from "./modules/+page.svelte";
    import Database from "./database/+page.svelte";
    import DashAccount from "./account/+page.svelte";
    import { writable } from "svelte/store";

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
    <div
        class="flex place-items-center justify-center sticky top-0 backdrop-blur-lg dark:bg-black/80 bg-gray-50/80"
    >
        <div
            class="w-full flex-grow px-2 sm:px-8 md:px-24 lg:px-32 border-b dark:border-b-gray-900 border-b-gray-100"
        >
            <div id="header-borderless-parent">
                <Tabs border={true}>
                    <TabItem
                        initialSelected={$page.url.pathname === "/app" ||
                            $page.url.pathname === "/app/overview"}
                        on:clicked={() => ($currentPageIndex = 0)}
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
                                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                        <Spacer w={10} />
                        Overview</TabItem
                    >
                    <TabItem
                        initialSelected={$page.url.pathname ===
                            "/app/deployment"}
                        on:clicked={() => ($currentPageIndex = 1)}
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
                                d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                            />
                        </svg>
                        <Spacer w={10} />
                        Deployment</TabItem
                    >
                    <TabItem
                        initialSelected={$page.url.pathname === "/app/modules"}
                        on:clicked={() => ($currentPageIndex = 2)}
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
                                d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
                            />
                        </svg>
                        <Spacer w={10} />
                        Modules</TabItem
                    >
                    <TabItem
                        initialSelected={$page.url.pathname === "/app/database"}
                        on:clicked={() => ($currentPageIndex = 3)}
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
                                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                            />
                        </svg>
                        <Spacer w={10} />
                        Database</TabItem
                    >
                    <TabItem
                        initialSelected={$page.url.pathname === "/app/account"}
                        on:clicked={() => ($currentPageIndex = 4)}
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
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        <Spacer w={10} />
                        Dash Account</TabItem
                    >
                </Tabs>
            </div>
        </div>
    </div>

    <svelte:component
        this={[Overview, Deployment, Modules, Database, DashAccount][
            $currentPageIndex < 0 || $currentPageIndex > 4
                ? 0
                : $currentPageIndex
        ]}
    />
</main>
