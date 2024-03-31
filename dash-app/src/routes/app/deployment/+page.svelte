<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";

    import { Center, Note, Text } from "geist-ui-svelte";
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";
    import Spinner from "../../components/Spinner.svelte";

    let currentSectionIndex = writable<number>(0);

    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/deployment");

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
    });
</script>

{#if accountType === ""}
    <Center class="p-16">
        <Spinner class="m-4"/>
    </Center>
{:else if accountType === "Admin" || accountType === "Root"}
    <AppHeader Title="Deployment"></AppHeader>
    <AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
        <svelte:fragment slot="navigation">
            <div
                class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
            >
                <Text size="xs" class="display-none md:block ml-2"
                    >MANAGEMENT</Text
                >
                <NavButton
                    active={$currentSectionIndex === 0}
                    btnClicked={() => currentSectionIndex.set(0)}
                    >Nodes
                </NavButton>
                <NavButton
                    active={$currentSectionIndex === 1}
                    btnClicked={() => currentSectionIndex.set(1)}
                    >Configuration
                </NavButton>
                <NavButton
                    active={$currentSectionIndex === 2}
                    btnClicked={() => currentSectionIndex.set(2)}
                    >Secrets
                </NavButton>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            
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
