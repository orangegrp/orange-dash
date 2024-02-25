<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import type { DashSession } from "$lib/auth/dash.d.ts";

    import { Text, Button, Modal, Spacer } from "geist-ui-svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";

    import General from "./sections/general.svelte";
    import Security from "./sections/security.svelte";
    import DangerZone from "./sections/danger_zone.svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/account");
    });

    let logoutConfirmation = false;
    let currentSectionIndex = writable<number>(0);
</script>

<AppHeader Title="Dash Account">
    <Button on:click={() => (logoutConfirmation = true)}>Log Out</Button>
</AppHeader>

<AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
    <svelte:fragment slot="navigation">
        <div
            class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
        >
            <Text size="xs" class="display-none md:block ml-2">ACCOUNT</Text>
            <NavButton active={$currentSectionIndex === 0} btnClicked={() => currentSectionIndex.set(0)}>General</NavButton>
            <NavButton active={$currentSectionIndex === 1} btnClicked={() => currentSectionIndex.set(1)}>Security</NavButton>
            <Text size="xs" class="display-none md:block mt-2 ml-2">ADDITIONAL</Text>
            <NavButton active={$currentSectionIndex === 2} btnClicked={() => currentSectionIndex.set(2)}>Danger Zone</NavButton>
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

<Modal
    bind:visible={logoutConfirmation}
    class="sm:w-[50vw] md:w-[40vw] lg:w-[25vw] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
	 justify-center"
    >
        <Text type="h5">Log Out</Text>
        <Spacer h={10} />
        <Text align="center" color="secondary">
            You will be signed out of Dash on this device.
        </Text>
        <Spacer h={20} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button width="100%" color="secondary" href="/logout">
                Log out
            </Button>
            <Button width="100%" on:click={() => (logoutConfirmation = false)}>
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>