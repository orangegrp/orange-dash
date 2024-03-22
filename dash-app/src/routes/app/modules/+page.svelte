<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import { page } from "$app/stores";
    import MessageDialogue from "../../components/dialogue/MessageDialogue.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import {
        FieldSet,
        Text,
        Button,
        Input,
        Select,
        Option,
    } from "geist-ui-svelte";
    import TextInput from "../../components/TextInput.svelte";
    import { writable } from "svelte/store";

    let currentModuleIndex = writable<number>(0);

    let sessionId = "";
    let showMessage = false;
    let messageTitle = "";
    let messageContent = "";

    let moduleInfo;

    /**
    $: {
        if (
            moduleInfo &&
            moduleInfo.data[$currentModuleIndex] &&
            moduleInfo.data[$currentModuleIndex].values
        ) {
            setTimeout(() => {
                for (
                    let i = 0;
                    i < moduleInfo.data[$currentModuleIndex].values.length;
                    i++
                ) {
                    console.log(`itemcard-${i}`);
                    changeBackground(`itemcard-${i}`);
                }
            }, 0);
        }
    }
    */

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

<!-- svelte-ignore non-top-level-reactive-declaration -->
<!-- svelte-ignore non-top-level-reactive-declaration -->
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
                {#each moduleInfo.data as moduleItem, index}
                    <NavButton
                        active={$currentModuleIndex === index}
                        btnClicked={() => currentModuleIndex.set(index)}
                        >{moduleItem.displayName}</NavButton
                    >
                {/each}
            {/if}
        </div>
    </svelte:fragment>

    <svelte:fragment slot="content">
        {#if moduleInfo !== undefined}
            <div class="flex flex-col gap-2">
                <Text type="h3" class="font-light"
                    >{moduleInfo.data[$currentModuleIndex].displayName}</Text
                >
                <div id="module-parameters">
                    {#each moduleInfo.data[$currentModuleIndex].values as moduleValue, index}
                        <div
                            class="mt-4 shadow-2xl w-full"
                            id={`itemcard-${index}`}
                        >
                            <FieldSet>
                                <div
                                    class="p-2 max-w-full min-w-full md:min-w-[500px]"
                                    slot="default"
                                >
                                    <Text
                                        type="h4"
                                        class="font-normal flex flex-row place-items-center gap-x-2"
                                    >
                                        {moduleValue.displayName}
                                        <Text
                                            size="xs"
                                            blockquote
                                            color="secondary"
                                        >
                                            {#if moduleValue.type === 0}
                                                string
                                            {:else if moduleValue.type === 1}
                                                number
                                            {:else if moduleValue.type === 2}
                                                integer
                                            {:else if moduleValue.type === 3}
                                                user
                                            {:else if moduleValue.type === 4}
                                                channel
                                            {:else if moduleValue.type === 5}
                                                member
                                            {:else if moduleValue.type === 6}
                                                object
                                            {/if}
                                        </Text>
                                    </Text>
                                    <Text size="sm" class="dark:text-gray-200">
                                        {moduleValue.description}
                                    </Text>
                                    <div class="my-2">
                                        {#if moduleValue.type === 0}
                                            <TextInput
                                                type="text"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 1}
                                            <TextInput
                                                type="number"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 2}
                                            <TextInput
                                                type="number"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 3}
                                            <TextInput
                                                type="text"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 4}
                                            <TextInput
                                                type="text"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 5}
                                            <TextInput
                                                type="text"
                                                value={moduleValue.value}
                                            />
                                        {:else if moduleValue.type === 6}
                                            <TextInput
                                                type="text"
                                                value={moduleValue.value}
                                            />
                                        {/if}
                                    </div>
                                </div>
                                <div slot="footer">
                                    <div class="flex justify-end">
                                        <Button
                                            color="secondary-light"
                                            size="sm"
                                            on:click={() => {}}>Save</Button
                                        >
                                    </div>
                                </div>
                            </FieldSet>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </svelte:fragment>
</AppContent>
