<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { DashUser } from "$lib/auth/dash";
    import {
        Note,
        Text,
        FieldSet,
        Spacer,
        Button,
        Modal,
        Input,
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
    let deleteConfirmationInput = "";
    let lockConfirmation = false;

    let dashId = "";

    onMount(() => {
        changeBackground("delete-action-card");
        changeBackground("lock-action-card");

        const dashAccount = $page.data.dash_account as DashUser;
        dashId = dashAccount.id;
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
                <Text type="h4" class="font-normal">Lock Account</Text>
                <Text size="sm" class="dark:text-gray-200"
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
                <Text type="h4" class="font-normal">Delete Account</Text>
                <Text size="sm" class="dark:text-gray-200"
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
            <Button
                width="100%"
                color="warning"
                on:click={() => {
                    lockConfirmation = false;
                    fetch(`/api/account/lock`, {
                        method: "POST",
                    }).then(async (r) => goto((await r.json()).goto));
                }}
            >
                Lock Account</Button
            >
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
        <Input
            placeholder={dashId}
            bind:value={deleteConfirmationInput}
            width="100%"
            size="base"
        />
        <Spacer h={20} />
        <div class="w-full flex flex-row justify-between gap-x-4">
            <Button
                width="100%"
                color="error"
                on:click={() => {
                    if (deleteConfirmationInput === dashId) {
                        deleteConfirmation = false;
                        fetch(`/api/account/delete`, {
                            method: "POST",
                        }).then(async (r) => goto((await r.json()).goto));
                    } else {
                        deleteConfirmation = false;
                        setTimeout(() => (deleteConfirmation = true), 100);
                    }
                }}>Delete</Button
            >
            <Button width="100%" on:click={() => (deleteConfirmation = false)}>
                Cancel
            </Button>
        </div>
        <Spacer h={10} />
    </div>
</Modal>