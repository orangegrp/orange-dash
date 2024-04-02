<script lang="ts">
    import { Button, FieldSet, Text, ToolTip } from "geist-ui-svelte";
    import TextInput from "../../../components/TextInput.svelte";
    export let moduleValue: any;
    export let moduleInfo: any;
    export let currentModuleIndex;
    export let showMessage;
    export let messageTitle;
    export let messageContent;
    export let showProcessMessage;
    export let sessionId;
    export let moduleTarget;

    async function updateData(
        module: string,
        property: string,
        new_value: string,
        is_string: boolean,
    ) {
        return await fetch(`/api/modules/${module}`, {
            method: "POST",
            headers: {
                "X-User-Snowflake": moduleTarget,
                "X-Dash-SessionId": sessionId,
                "X-Old-Value": JSON.stringify(moduleValue.value),
                "Content-Type": "application/json",
            },
            body: `{ "${property}": ${is_string ? `"${new_value}"` : new_value} }`,
        });
    }
</script>

<FieldSet>
    <div class="p-2 max-w-full min-w-full md:min-w-[500px]" slot="default">
        <Text
            type="h4"
            class="font-normal flex flex-row place-items-center gap-x-2"
        >
            {moduleValue.displayName}
            <Text size="xs" blockquote color="secondary">
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
        <Text size="sm" class="dark:text-gray-200">
            {moduleValue.description}
        </Text>
        <div class="my-2">
            {#if !moduleValue.array}
                {@const invalid_data =
                    (moduleValue.minValue !== undefined &&
                        moduleValue.minValue > moduleValue.value) ||
                    (moduleValue.maxValue !== undefined &&
                        moduleValue.maxValue < moduleValue.value) ||
                    ((moduleValue.type === 1 || moduleValue.type === 2) &&
                        isNaN(moduleValue.value))}
                {#if (moduleValue.type < 1 || moduleValue.type > 2) && moduleValue.type < 7}
                    <TextInput
                        type="text"
                        disabled={moduleValue.uiVisibility === "readonly"}
                        bind:value={moduleValue.value}
                    />
                {:else if moduleValue.type === 1 || moduleValue.type === 2}
                    <TextInput
                        type="number"
                        disabled={moduleValue.uiVisibility === "readonly"}
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
        <div class="flex place-items-center justify-between">
            <Text type="small" color="secondary">
                {#if moduleValue.maxCount !== undefined}
                    Max items: <Text blockquote class="mr-2"
                        >{moduleValue.maxCount}</Text
                    >
                {/if}
                {#if moduleValue.maxLength !== undefined}
                    Max length: <Text blockquote class="mr-2"
                        >{moduleValue.maxLength}</Text
                    >
                {/if}
                {#if moduleValue.minLength !== undefined}
                    Min length: <Text blockquote class="mr-2"
                        >{moduleValue.minLength}</Text
                    >
                {/if}
                {#if moduleValue.minValue !== undefined && moduleValue.maxValue !== undefined}
                    Value range: <Text blockquote class="mr-2"
                        >{moduleValue.minValue} -
                        {moduleValue.maxValue}</Text
                    >
                {:else}
                    {#if moduleValue.minValue !== undefined}
                        Min value: <Text blockquote class="mr-2"
                            >{moduleValue.minValue}</Text
                        >
                    {/if}
                    {#if moduleValue.maxValue !== undefined}
                        Max value: <Text blockquote class="mr-2"
                            >{moduleValue.maxValue}</Text
                        >
                    {/if}
                {/if}
            </Text>
            <Button
                color="secondary-light"
                size="sm"
                disabled={moduleValue.uiVisibility === "readonly"}
                on:click={() => {
                    showProcessMessage = true;
                    console.log(
                        moduleInfo.data[$currentModuleIndex].module,
                        moduleValue.name,
                        moduleValue.value,
                        moduleValue.type,
                    );
                    setTimeout(async () => {
                        const r = await updateData(
                            moduleInfo.data[$currentModuleIndex].module,
                            moduleValue.name,
                            moduleValue.value,
                            (moduleValue.type < 1 || moduleValue.type > 2) &&
                                moduleValue.type < 7,
                        );
                        const res = await r.json();
                        showProcessMessage = false;
                        if (r.status === 200) {
                            //messageTitle =
                            //    "Request succeeded";
                            //messageContent =
                            //    JSON.stringify(
                            //        res,
                            //    );
                            //showMessage = true;

                            setTimeout(() => location.reload(), 100);
                        } else {
                            messageTitle = "Request failed";
                            messageContent = res.reason;
                            showMessage = true;
                        }
                    }, 1000);
                }}>Save</Button
            >
        </div>
    </div>
</FieldSet>
