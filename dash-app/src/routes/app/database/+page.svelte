<script lang="ts">
    import { onMount } from "svelte";
    import { Center, Note } from "geist-ui-svelte";
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import Spinner from "../../components/Spinner.svelte";

    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/database");

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
    });
</script>

{#if accountType === ""}
    <Center class="p-16">
        <Spinner class="m-4"/>
    </Center>
{:else if accountType === "Admin" || accountType === "Root"}
<main>
    <iframe title="Pocketbase" class="w-screen h-[80vh]" src="https://pocketbase-aci1.vcn1.order332.com/_/"/>
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