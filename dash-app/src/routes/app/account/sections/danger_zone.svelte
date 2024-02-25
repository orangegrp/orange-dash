<script lang="ts">
    import { page } from "$app/stores";
    import type { DashSession } from "$lib/auth/dash";
    import {
        Note,
        Text,
        FieldSet,
        Spacer,
        Button,
        Modal,
        Input,
        Center,
    } from "geist-ui-svelte";
    import { onMount } from "svelte";

    // hack workaround
    function changeBackground(elem_id: string) {
        const parent = document.getElementById(elem_id);
        const target = parent.childNodes[0].childNodes[0];
        (target as HTMLElement).classList.add("dark:bg-gray-975/100");
        (target as HTMLElement).classList.remove("dark:bg-gray-999");
    }

    let deleteConfirmation = false;
    let lockConfirmation = false;

    let dashId = "";

    onMount(() => {
        changeBackground("delete-action-card");
        changeBackground("lock-action-card");

        const userSession = $page.data.session as DashSession;
        dashId = userSession.dash_id;
    });
</script>

<div class="w-full">
    <Note color="error">
        <Text slot="label" b>WARNING:</Text>
        Actions on this page could result in permanent data loss which is irreversible.
    </Note>

    <div class="mt-4" id="lock-action-card">
        <FieldSet color="transparent">
            <div class="p-2">
                <Text type="h4" class="font-bold">Lock Account</Text>
                <Text size="sm"
                    >If you suspect your account is compromised, you can lock it
                    to prevent future logins. To unlock your account afterwards,
                    please contact a Dash administrator.</Text
                >
                <Spacer h={10} />
            </div>
            <div slot="footer" class="flex justify-end">
                <Button
                    color="secondary-light"
                    size="sm"
                    on:click={() => (lockConfirmation = true)}
                    >Lock Account</Button
                >
            </div>
        </FieldSet>
    </div>

    <div class="mt-4" id="delete-action-card">
        <FieldSet color="error">
            <div class="p-2">
                <Text type="h4" class="font-bold">Delete Account</Text>
                <Text size="sm"
                    >Permanently delete your Dash account and all associated
                    data from Dash. This action is irreversible.</Text
                >
                <Spacer h={10} />
            </div>
            <div slot="footer" class="flex justify-end">
                <Button
                    color="error-light"
                    size="sm"
                    on:click={() => (deleteConfirmation = true)}
                    >Delete Account</Button
                >
            </div>
        </FieldSet>
    </div>
</div>

<Modal
    bind:visible={lockConfirmation}
    class="sm:w-[50vw] md:w-[40vw] lg:w-[25vw] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
	 justify-center"
    >
        <Text type="h5">Lock Account</Text>
        <Spacer h={10} />
        <Text align="center" color="warning">
            Your account will be <Text b>completely unusable</Text> after you lock
            it. You will be signed out of Dash from all devices.
        </Text>
        <Spacer h={20} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button width="100%" color="warning">Lock Account</Button>
            <Button width="100%" on:click={() => (lockConfirmation = false)}>
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>

<Modal
    bind:visible={deleteConfirmation}
    class="sm:w-[50vw] md:w-[40vw] lg:w-[25vw] h-fit"
>
    <div
        class="p-6 flex flex-col place-items-center
	 justify-center"
    >
        <Text type="h5">Delete Account</Text>
        <Spacer h={10} />
        <Text color="error">
            Type <Text b blockquote class="select-none">{dashId}</Text> to delete
            your account.
        </Text>
        <Spacer h={10} />
        <Input placeholder={dashId} width="100%" size="base" />
        <Spacer h={20} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button width="100%" color="error">Delete</Button>
            <Button width="100%" on:click={() => (deleteConfirmation = false)}>
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>

<style>
    .iframe-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: var(
            --aspect-ratio,
            100%
        ); /* Default to  100% if no aspect ratio is set */
        overflow: hidden;
    }

    .iframe-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
