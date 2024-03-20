<script lang="ts">
    import { Modal, Text, Spacer, Button } from "geist-ui-svelte";
    export let show: boolean = false;

    export let title: string = "";
    export let message: string = "";
    export let actionButtonText: string = "Confirm";
    export let buttonText: string = "Cancel";
    export let txtColor:
        | "inherit"
        | "success"
        | "warning"
        | "error"
        | "secondary"
        | "abort"
        | "dark" = "inherit";
    export let actionBtnColor:
        | "success"
        | "warning"
        | "error"
        | "secondary"
        | "abort"
        | "default"
        | "secondary-light"
        | "success-light"
        | "warning-light"
        | "error-light"
        | "abort-active"
        | "tab" = "default";
    export let btnColor:
        | "success"
        | "warning"
        | "error"
        | "secondary"
        | "abort"
        | "default"
        | "secondary-light"
        | "success-light"
        | "warning-light"
        | "error-light"
        | "abort-active"
        | "tab" = "default";
    export let action: (e: MouseEvent) => void = () => {};
    export let nonaction: (e: MouseEvent) => void = () => {};
    export let href = "";
</script>

<div>
    <Modal
        bind:visible={show}
        class="w-fit sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[30vw] xl:max-w-[23vw] h-fit"
    >
        <div
            class="p-6 flex flex-col place-items-center
	 justify-center"
        >
            {#if title}
                <Text type="h5">{title}</Text>
                <Spacer h={5} />
            {/if}
            {#if message}
                <Text align="center" color={txtColor}>
                    {message}
                </Text>
            {/if}

            <slot />

            <Spacer h={20} />

            <div class="w-full flex flex-row justify-between gap-x-4">
                <Button
                    width="100%"
                    color={actionBtnColor}
                    {href}
                    on:click={(e) => {
                        show = false;
                        if (action) action(e);
                    }}
                >
                    {actionButtonText}
                </Button>
                <Button
                    width="100%"
                    color={btnColor}
                    on:click={(e) => {
                        show = false;
                        if (nonaction) nonaction(e);
                    }}
                >
                    {buttonText}
                </Button>
            </div>

            <Spacer h={10} />
        </div>
    </Modal>
</div>
