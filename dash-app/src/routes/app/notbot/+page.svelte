<script>
    import { onMount } from "svelte";
    import { Button, Center, Note } from "geist-ui-svelte";
    import DashIframe from "../../components/DashIframe.svelte";
    import Spinner from "../../components/Spinner.svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/notbot");
    });

    export let visible = true;
</script>

<main>
    <div class="m-2">
        <Note label={false} color="warning">
            <div class="flex flex-row gap-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#fb923c"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                </svg>
                <div class="flex flex-row justify-between w-full">
                    NotBot™ is a legacy system which may have bugs and stability issues. If the application freezes on the loading screen, use the Reload button to resolve the issue. Do not reload your browser as it could deauthorise your Dash session.
                    <Button size="sm" class="ml-4" color="warning" ghost on:click={() => { visible = false; setTimeout(() => {visible = true}, 1000)}}>
                        <div class="flex flex-row gap-x-2 place-items-center">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                        Reload
                        </div>
                    </Button>
                </div>
            </div>
        </Note>
    </div>

    <!--
            <iframe title="NotBot" class="w-screen h-[80vh]" src="/notbot-proxy" />
    -->
    {#if visible}
    <DashIframe
        src="/notbot-proxy"
        rewriteproxy="/notbot-proxy"
        class="w-screen h-[80vh]"
    />
    {:else}
    <Center class="p-16">
        Reconnecting to NotBot™
        <Spinner class="m-4"/>
    </Center>
    {/if}
</main>
