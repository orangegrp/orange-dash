<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";
    import { page } from "$app/stores";
    import MessageDialogue from "../../components/dialogue/MessageDialogue.svelte";
    import NavButton from "../../components/NavButton.svelte";
    import { FieldSet, Text, Button, Spacer, ToolTip, Skeleton } from "geist-ui-svelte";
    import TextInput from "../../components/TextInput.svelte";
    import { writable } from "svelte/store";
    import ProcessDialogue from "../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import Table from "../../components/table/Table.svelte";
    import Row from "../../components/table/Row.svelte";
    import Item from "../../components/table/Item.svelte";
    import SingleValueField from "./components/SingleValueField.svelte";
    import ArrayValueField from "./components/ArrayValueField.svelte";

    let currentModuleIndex = writable<number>(0);
    let showProcessMessage = false;

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
                                <!--
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

                                                {#if moduleValue.uiVisibility === "readonly"}
                                                    &nbsp;(Read-only)
                                                {/if}
                                            </Text>
                                        </Text>
                                        <Text
                                            size="sm"
                                            class="dark:text-gray-200"
                                        >
                                            {moduleValue.description}
                                        </Text>
                                        <div class="my-2">
                                            {#if moduleValue.array}
                                                <Table>
                                                    <Row header>
                                                        <Item
                                                            header
                                                            headerPos="left"
                                                            >Value</Item
                                                        >
                                                        <Button
                                                            size="xs"
                                                            color="success-light"
                                                            class="px-2"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="w-4 h-4"
                                                            >
                                                                <path
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                                />
                                                            </svg>
                                                        </Button>
                                                    </Row>
                                                    {#each moduleValue.value as value}
                                                        <Row>
                                                            <Item>
                                                                <div
                                                                    class="flex flex-row justify-between place-items-center gap-x-4"
                                                                >
                                                                    {value}
                                                                </div>
                                                            </Item>
                                                            <svelte:fragment
                                                                slot="hover"
                                                            >
                                                                <div
                                                                    class="flex flex-row place-items-center gap-x-1"
                                                                >
                                                                    <Button
                                                                        id="up-{index}"
                                                                        size="xs"
                                                                        class="px-2"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            class="w-4 h-4"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                                                            />
                                                                        </svg>
                                                                    </Button>
                                                                    <Button
                                                                        id="down-{index}"
                                                                        size="xs"
                                                                        class="px-2"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            class="w-4 h-4"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                                            />
                                                                        </svg>
                                                                    </Button>
                                                                    <Button
                                                                        id="edit-{index}"
                                                                        size="xs"
                                                                        color="success-light"
                                                                        class="px-2"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            class="w-4 h-4"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                            />
                                                                        </svg>
                                                                    </Button>
                                                                    <Button
                                                                        size="xs"
                                                                        id="delete-{index}"
                                                                        color="error-light"
                                                                        class="px-2"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            class="w-4 h-4"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                            />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                            </svelte:fragment>
                                                        </Row>
                                                    {/each}
                                                </Table>
                                            {:else}
                                                {@const invalid_data =
                                                    (moduleValue.minValue !==
                                                        undefined &&
                                                        moduleValue.minValue >
                                                            moduleValue.value) ||
                                                    (moduleValue.maxValue !==
                                                        undefined &&
                                                        moduleValue.maxValue <
                                                            moduleValue.value) ||
                                                    ((moduleValue.type === 1 ||
                                                        moduleValue.type ===
                                                            2) &&
                                                        isNaN(
                                                            moduleValue.value,
                                                        ))}
                                                {#if moduleValue.type === 0}
                                                    <TextInput
                                                        type="text"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 1}
                                                    <TextInput
                                                        type="number"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 2}
                                                    <TextInput
                                                        type="number"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 3}
                                                    <TextInput
                                                        type="text"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 4}
                                                    <TextInput
                                                        type="text"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 5}
                                                    <TextInput
                                                        type="text"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {:else if moduleValue.type === 6}
                                                    <TextInput
                                                        type="text"
                                                        disabled={moduleValue.uiVisibility ===
                                                            "readonly"}
                                                        bind:value={moduleValue.value}
                                                    />
                                                {/if}

                                                {#if invalid_data}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="orange"
                                                        class="inline w-6 h-6"
                                                        id="{moduleValue.name}_alert"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                                        />
                                                    </svg>
                                                    <ToolTip
                                                        placement="top-start"
                                                        anchor="#{moduleValue.name}_alert"
                                                        content="Invalid value"
                                                    />
                                                {/if}
                                            {/if}
                                        </div>
                                    </div>
                                    <div slot="footer">
                                        <div
                                            class="flex place-items-center justify-between"
                                        >
                                            <Text
                                                type="small"
                                                color="secondary"
                                            >
                                                {#if moduleValue.maxCount !== undefined}
                                                    Max items: <Text
                                                        blockquote
                                                        class="mr-2"
                                                        >{moduleValue.maxCount}</Text
                                                    >
                                                {/if}
                                                {#if moduleValue.minValue !== undefined && moduleValue.maxValue !== undefined}
                                                    Value range: <Text
                                                        blockquote
                                                        class="mr-2"
                                                        >{moduleValue.minValue} -
                                                        {moduleValue.maxValue}</Text
                                                    >
                                                {:else}
                                                    {#if moduleValue.minValue !== undefined}
                                                        Min value: <Text
                                                            blockquote
                                                            class="mr-2"
                                                            >{moduleValue.minValue}</Text
                                                        >
                                                    {/if}
                                                    {#if moduleValue.maxValue !== undefined}
                                                        Max value: <Text
                                                            blockquote
                                                            class="mr-2"
                                                            >{moduleValue.maxValue}</Text
                                                        >
                                                    {/if}
                                                {/if}
                                            </Text>
                                            <Button
                                                color="secondary-light"
                                                size="sm"
                                                disabled={moduleValue.uiVisibility ===
                                                    "readonly"}
                                                on:click={() => {
                                                    showProcessMessage = true;
                                                    console.log(
                                                        moduleInfo.data[
                                                            $currentModuleIndex
                                                        ].module,
                                                        moduleValue.name,
                                                        moduleValue.value,
                                                        moduleValue.type,
                                                    );
                                                    setTimeout(async () => {
                                                        const r =
                                                            await updateData(
                                                                moduleInfo.data[
                                                                    $currentModuleIndex
                                                                ].module,
                                                                moduleValue.name,
                                                                moduleValue.value,
                                                                moduleValue.type ===
                                                                    0,
                                                            );
                                                        const res =
                                                            await r.json();
                                                        showProcessMessage = false;
                                                        if (r.status === 200) {
                                                            messageTitle =
                                                                "Request succeeded";
                                                            messageContent =
                                                                JSON.stringify(
                                                                    res,
                                                                );
                                                            showMessage = true;

                                                            setTimeout(
                                                                () =>
                                                                    location.reload(),
                                                                10000,
                                                            );
                                                        } else {
                                                            messageTitle =
                                                                "Request failed";
                                                            messageContent =
                                                                res.reason;
                                                            showMessage = true;
                                                        }
                                                    }, 1000);
                                                }}>Save</Button
                                            >
                                        </div>
                                    </div>
                                </FieldSet>
                                -->
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {:else}
            <div class="flex flex-col gap-4">
                {#each [0, 0, 0, 0, 0] as tmp}
                <FieldSet>
                    <div class="p-2 max-w-full min-w-full md:min-w-[500px]" slot="default">
                        <Skeleton class="w-3/4 h-8 rounded-lg" />
                        <div class="mt-4 my-2 flex flex-col gap-y-2">
                            <Skeleton class="w-2/4 h-4 rounded-md" />
                            <Skeleton class="w-4/5 h-6 rounded-md" />
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="flex place-items-center justify-between">
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
