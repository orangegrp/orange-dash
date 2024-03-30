<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";

    import { Button, Note, Text } from "geist-ui-svelte";
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";
    import Table from "../../components/table/Table.svelte";
    import Row from "../../components/table/Row.svelte";
    import Item from "../../components/table/Item.svelte";

    import Audit from "./audit-log/+page.svelte";

    let currentSectionIndex = writable<number>(0);

    switch ($page.url.pathname) {
        case "/app/admin/debug":
            $currentSectionIndex = 2;
            break;
        case "/app/admin/audit-log":
            $currentSectionIndex = 1;
            break;
        case "/app/admin/user-accounts":
        case "/app/admin":
        default:
            $currentSectionIndex = 0;
            break;
    }
    
    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/admin");

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
    });
</script>

{#if accountType === "Admin" || accountType === "Root"}
    <AppHeader Title="Admin Area"></AppHeader>
    <AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
        <svelte:fragment slot="navigation">
            <div
                class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
            >
                <Text size="xs" class="display-none md:block ml-2"
                    >ACCOUNT MANAGEMENT</Text
                >
                <NavButton
                    active={$currentSectionIndex === 0}
                    btnClicked={() => currentSectionIndex.set(0)}
                    >User Accounts
                </NavButton>
                <Text size="xs" class="display-none md:block mt-2 ml-2"
                    >SYSTEM</Text
                >
                <NavButton
                    active={$currentSectionIndex === 1}
                    btnClicked={() => currentSectionIndex.set(1)}
                    >Audit Log
                </NavButton>
                <NavButton
                    active={$currentSectionIndex === 2}
                    btnClicked={() => currentSectionIndex.set(2)}
                    >Debug
                </NavButton>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            {#key $currentSectionIndex}
                <svelte:component
                    this={[Audit, Audit, Audit][
                        $currentSectionIndex < 0 || $currentSectionIndex > 2
                            ? 0
                            : $currentSectionIndex
                    ]}
                />
            {/key}
        </svelte:fragment>
    </AppContent>
{:else}
    <main class="m-8 flex flex-col place-items-center">
        <Note color="error" label={false}>
            <div class="flex flex-row gap-x-2">
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
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
                Access Denied. This feature is not available to this Dash account.
            </div>
        </Note>
    </main>
{/if}
