<script lang="ts">
    import { Modal, Text, Spacer, Button } from "geist-ui-svelte";
    export let show: boolean = false;

    export let title: string = "";
    export let message: string = "";
    export let txtColor:
        | "inherit"
        | "success"
        | "warning"
        | "error"
        | "secondary"
        | "abort"
        | "dark" = "inherit";
</script>

<div>
    <Modal
        bind:visible={show}
        class="w-fit sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[25vw] xl:max-w-[23vw] h-fit"
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
                <Spacer h={5} />
            {/if}

            <slot />
        </div>
    </Modal>
</div>
