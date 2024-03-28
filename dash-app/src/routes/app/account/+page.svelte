<script lang="ts">
    import { onMount } from "svelte";

    import { Text, Button } from "geist-ui-svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";

    import General from "./general/+page.svelte";
    import Security from "./security/+page.svelte";
    import DangerZone from "./danger-zone/+page.svelte";
    import ActionDialogue from "../../components/dialogue/ActionDialogue.svelte";

    let currentSectionIndex = writable<number>(0);

    switch ($page.url.pathname) {
        case "/app/account/danger-zone":
            $currentSectionIndex = 2;
            break;
        case "/app/account/security":
            $currentSectionIndex = 1;
            break;
        case "/app/account/general":
        case "/app/account":
        default:
            $currentSectionIndex = 0;
            break;
    }
</script>

<AppHeader Title="Account Manager"/>

<AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
    <svelte:fragment slot="navigation">
        <div
            class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
        >
            <Text size="xs" class="display-none md:block ml-2">ACCOUNT</Text>
            <NavButton
                active={$currentSectionIndex === 0}
                btnClicked={() => currentSectionIndex.set(0)}
                >General
            </NavButton>
            <NavButton
                active={$currentSectionIndex === 1}
                btnClicked={() => currentSectionIndex.set(1)}
                >Security
            </NavButton>
            <Text size="xs" class="display-none md:block mt-2 ml-2">
                ADDITIONAL
            </Text>
            <NavButton
                active={$currentSectionIndex === 2}
                btnClicked={() => currentSectionIndex.set(2)}
                >Danger Zone
            </NavButton>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        {#key $currentSectionIndex}
            <svelte:component
                this={[General, Security, DangerZone][
                    $currentSectionIndex < 0 || $currentSectionIndex > 2
                        ? 0
                        : $currentSectionIndex
                ]}
            />
        {/key}
    </svelte:fragment>
</AppContent>