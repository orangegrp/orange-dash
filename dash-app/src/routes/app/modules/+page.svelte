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
        Spacer,
        ToolTip,
        Skeleton,
        Search,
    } from "geist-ui-svelte";
    import { writable } from "svelte/store";
    import ProcessDialogue from "../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import SingleValueField from "./components/SingleValueField.svelte";
    import ArrayValueField from "./components/ArrayValueField.svelte";
    import type { DashUser } from "$lib/auth/dash";

    let currentModuleIndex = writable<number>(0);
    let showProcessMessage = false;

    let sessionId = "";
    let dashId = "";
    let userTarget = "";
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

        const dashAccount = $page.data.dash_account as DashUser;
        dashId = dashAccount.id;
        userTarget = dashAccount.oauth2_id;

        fetch(`/api/modules`, {
            method: "GET",
            headers: {
                "X-User-Snowflake": userTarget,
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

    let searchLoading = false;
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<!-- svelte-ignore non-top-level-reactive-declaration -->
<MessageDialogue
    bind:show={showMessage}
    title={messageTitle}
    message={messageContent}
    buttonText="OK"
/>

<ProcessDialogue bind:show={showProcessMessage} message="Saving changes">
    <Spacer h={10} />
    <Spinner />
</ProcessDialogue>

<AppHeader Title="Modules"></AppHeader>

<AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
    <svelte:fragment slot="navigation">
        <div
            class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
        >
            <div class="mb-0 md:mb-4">
                <Search
                    placeholder="User or guild"
                    bind:value={userTarget}
                    debounce={1000}
                    bind:loading={searchLoading}
                    on:input={() => (searchLoading = true)}
                />
            </div>

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
                        {#if moduleValue.uiVisibility !== "hidden"}
                            <div
                                class="mt-4 shadow-2xl w-full"
                                id={`itemcard-${index}`}
                            >
                                {#if moduleValue.array}
                                    <ArrayValueField
                                        bind:moduleTarget={userTarget}
                                        bind:moduleValue
                                        bind:moduleInfo
                                        bind:currentModuleIndex
                                        bind:showProcessMessage
                                        bind:showMessage
                                        bind:messageTitle
                                        bind:messageContent
                                        {sessionId}
                                    />
                                {:else}
                                    <SingleValueField
                                        bind:moduleTarget={userTarget}
                                        bind:moduleValue
                                        bind:moduleInfo
                                        bind:currentModuleIndex
                                        bind:showProcessMessage
                                        bind:showMessage
                                        bind:messageTitle
                                        bind:messageContent
                                        {sessionId}
                                    />
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {:else}
            <div class="flex flex-col gap-4">
                {#each [0, 0, 0, 0, 0] as tmp}
                    <FieldSet>
                        <div
                            class="p-2 max-w-full min-w-full md:min-w-[500px]"
                            slot="default"
                        >
                            <Skeleton class="w-3/4 h-8 rounded-lg" />
                            <div class="mt-4 my-2 flex flex-col gap-y-2">
                                <Skeleton class="w-2/4 h-4 rounded-md" />
                                <Skeleton class="w-4/5 h-6 rounded-md" />
                            </div>
                        </div>
                        <div slot="footer">
                            <div
                                class="flex place-items-center justify-between"
                            >
                                <Skeleton class="w-1/2 h-5 rounded-lg" />
                                <Skeleton class="w-16 h-7 rounded-lg" />
                            </div>
                        </div>
                    </FieldSet>
                {/each}
            </div>
        {/if}
    </svelte:fragment>
</AppContent>
