<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import { page } from "$app/stores";
    import MessageDialogue from "../../components/dialogue/MessageDialogue.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import { Text } from "geist-ui-svelte";
    import { writable } from "svelte/store";

    let currentModuleIndex = writable<number>(0);

    let sessionId = "";
    let showMessage = false;
    let messageTitle = "";
    let messageContent = "";

    let moduleInfo;

    onMount(() => {
        window.history.replaceState({}, "", "/app/modules");

        sessionId = $page.data.session_id;

        fetch(`/api/modules`, {
            method: "GET",
            headers: {
                "X-Dash-SessionId": sessionId,
            },
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                moduleInfo = res;
                console.log(res);
            } else {
                messageTitle = "Something went wrong";
                messageContent =
                    "Dash couldn't fetch the required data for this page. Reason: " +
                    res.reason;
                showMessage = true;
            }
        });
    });
</script>

<MessageDialogue
    bind:show={showMessage}
    title={messageTitle}
    message={messageContent}
    buttonText="OK"
/>

<AppHeader Title="Modules"></AppHeader>

<AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
    <svelte:fragment slot="navigation">
        <div
            class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
        >
            <Text size="xs" class="display-none md:block ml-2">MODULES</Text>

            {#if moduleInfo !== undefined}
                {#each moduleInfo.data as moduleItem}
                    <NavButton>{moduleItem.displayName}</NavButton>
                {/each}
            {/if}
        </div>
    </svelte:fragment>

    <svelte:fragment slot="content">
        <div>

        </div>
    </svelte:fragment>
</AppContent>

