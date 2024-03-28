<script lang="ts">
    import { onMount } from "svelte";
    import { Button, Center, Note, Text } from "geist-ui-svelte";
    import DashIframe from "../../components/DashIframe.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import { page } from "$app/stores";
    import type { DashUser } from "$lib/auth/dash";

    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/notbot");

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
    });

    let visible = true;
    let iframe_state: "loading" | "loaded" | "error" = "loading";
</script>

{#if accountType === "Admin" || accountType === "Root"}
    <main>
        <div class="m-2">
            <Note label={false} color="warning">
                <div class="flex flex-row gap-x-2 place-items-center">
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
                    <div
                        class="flex flex-row justify-between w-full place-items-center text-sm"
                    >
                        NotBot™ is a legacy system. If you encounter issues,
                        use the Reload button to restart the IFRAME application.
                        <Button
                            size="sm"
                            class="ml-4"
                            color="warning"
                            ghost
                            on:click={() => {
                                visible = false;
                                iframe_state = "loading";
                                setTimeout(() => {
                                    visible = true;
                                }, 1000);
                            }}
                        >
                            <div
                                class="flex flex-row gap-x-2 place-items-center"
                            >
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
        {#if iframe_state === "loading"}
            <Center class="p-16">
                Connecting to NotBot™
                <Spinner class="m-4" />
            </Center>
        {/if}
        {#if visible}
            <DashIframe
                src="/notbot-proxy"
                rewriteproxy="/notbot-proxy"
                bind:state={iframe_state}
                class="{iframe_state === 'loaded'
                    ? ''
                    : 'hidden'} w-screen h-[80vh]"
            />
            {#if iframe_state === "error"}
                <Center class="p-16">
                    NotBot™ Connection Failed
                    <Button
                        class="m-4"
                        ghost
                        on:click={() => {
                            visible = false;
                            iframe_state = "loading";
                            setTimeout(() => {
                                visible = true;
                            }, 1000);
                        }}
                    >
                        Retry
                    </Button>
                </Center>
            {/if}
        {/if}
    </main>
{:else}
    <main class="m-8 flex flex-col place-items-center">
        <Note color="error" label={false}>
            <div class="flex flex-row gap-x-2">
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
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                />
            </svg>
            Access Denied. This feature is not available to this Dash account.
            </div>
        </Note>
    </main>
{/if}
