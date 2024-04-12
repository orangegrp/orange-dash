<script lang="ts">
    import { onMount } from "svelte";
    import { Button, Center, Note, Text } from "geist-ui-svelte";
    import DashIframe from "../../components/DashIframe.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import { page } from "$app/stores";
    import type { DashUser } from "$lib/auth/dash";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";

    import Questions from "./questions/+page.svelte";
    import StudyContent from "./studycontent/+page.svelte";

    let allowed = false;
    let currentSectionIndex = writable<number>(0);

    switch ($page.url.pathname) {
        case "/app/studybot/studycontent":
            $currentSectionIndex = 1;
            break;
        case "/app/studybot/questions":
        case "/app/studybot":
        default:
            $currentSectionIndex = 0;
            break;
    }

    onMount(() => {
        window.history.replaceState({}, "", "/app/studybot");

        const dashAccount = $page.data.dash_account as DashUser;
        allowed = dashAccount.abac_str.includes("studybot");
    });
</script>

{#if allowed}
    <AppHeader Title="StudyBot™" />
    <AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
        <svelte:fragment slot="navigation">
            <div
                class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
            >
                <Text size="xs" class="display-none md:block ml-2"
                    >STUDYBOT</Text
                >
                <NavButton
                    active={$currentSectionIndex === 0}
                    btnClicked={() => currentSectionIndex.set(0)}
                    >Quiz Manager
                </NavButton>
                <NavButton
                    active={$currentSectionIndex === 1}
                    btnClicked={() => currentSectionIndex.set(1)}
                    >Content Manager
                </NavButton>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            {#key $currentSectionIndex}
                <svelte:component
                    this={[Questions, StudyContent][
                        $currentSectionIndex < 0 || $currentSectionIndex > 1
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
                Access Denied. This applet is not available to this Dash account.
            </div>
        </Note>
    </main>
{/if}
