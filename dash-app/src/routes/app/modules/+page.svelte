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
        Table,
        Spacer,
        Note,
        ToolTip,
    } from "geist-ui-svelte";
    import TextInput from "../../components/TextInput.svelte";
    import { writable } from "svelte/store";
    import ProcessDialogue from "../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import { invalidate } from "$app/navigation";

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

    function getArrayData(raw_data) {
        const array = [];
        for (let i = 0; i < raw_data.length; i++) {
            const elem = raw_data[i];
            array.push({ value: elem });
        }
        return array;
    }

    async function updateData(
        module: string,
        property: string,
        new_value: string,
        is_string: boolean,
    ) {
        return await fetch(`/api/modules/${module}`, {
            method: "POST",
            headers: {
                "X-Dash-SessionId": sessionId,
                "Content-Type": "application/json",
            },
            body: `{ "${property}": ${is_string ? `"${new_value}"` : new_value} }`,
        });
    }

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

<ProcessDialogue bind:show={showProcessMessage} message="Processing request">
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
                                                {(() => {
                                                    document
                                                        .querySelectorAll(
                                                            '[role="table"]',
                                                        )
                                                        .forEach(function (el) {
                                                            const child_1 =
                                                                el
                                                                    .childNodes[1];
                                                            const children =
                                                                child_1.childNodes;
                                                            for (const child of children) {
                                                                child.addEventListener(
                                                                    "mouseover",
                                                                    (
                                                                        event,
                                                                    ) => {},
                                                                );
                                                            }
                                                        });
                                                })()}
                                                <Table
                                                    animate
                                                    data={getArrayData(
                                                        moduleValue.value,
                                                    )}
                                                    columns={[
                                                        {
                                                            label: moduleValue.name,
                                                            property: "value",
                                                        },
                                                    ]}
                                                />
                                                <Spacer h={20} />
                                                <div
                                                    class="flex flex-row gap-x-2"
                                                >
                                                    <Button color="error-light">
                                                        Remove item
                                                    </Button>
                                                    <Button
                                                        color="success-light"
                                                    >
                                                        Add a new item
                                                    </Button>
                                                </div>
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
                            </div>
                        {/if}
                    {/each}
                </div>

                <div class="mt-8 w-full flex flex-row">
                    <Button
                        color="secondary"
                        size="md"
                        on:click={() => {
                            showProcessMessage = true;
                        }}>Save all</Button
                    >
                </div>
            </div>
        {/if}
    </svelte:fragment>
</AppContent>

<style>
</style>
