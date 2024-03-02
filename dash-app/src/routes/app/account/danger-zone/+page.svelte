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
        Input,
    } from "geist-ui-svelte";
    import { onMount } from "svelte";
    import ActionDialogue from "../../../components/dialogue/ActionDialogue.svelte";
    import MessageDialogue from "../../../components/dialogue/MessageDialogue.svelte";

    // hack workaround
    function changeBackground(elem_id: string) {
        const parent = document.getElementById(elem_id);
        const target = parent.childNodes[0].childNodes[0];
        (target as HTMLElement).classList.add("dark:bg-gray-975/100");
        (target as HTMLElement).classList.remove("dark:bg-gray-999");
    }

    let showMessage = false;
    let messageTitle = "";
    let messageContent = "";

    let showLockConfirmation = false;
    let showDeleteConfirmation = false;
    let deleteConfirmationInput = "";

    let sessionId = "";
    let userId = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/account/danger-zone");

        changeBackground("delete-action-card");
        changeBackground("lock-action-card");

        const dashAccount = $page.data.dash_account as DashUser;
        userId = dashAccount.id;
        sessionId = $page.data.session_id;
    });
</script>

<div class="w-full">
    <Note color="error">
        <Text slot="label" b>WARNING:</Text>
        Actions on this page could result in permanent data loss which is irreversible.
    </Note>

    <div class="mt-4 dark:shadow-gray-985 shadow-2xl" id="lock-action-card">
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
                    on:click={() => (showLockConfirmation = true)}
                    >Lock Account</Button
                >
            </div>
        </FieldSet>
    </div>

    <div class="mt-4 dark:shadow-gray-985 shadow-2xl" id="delete-action-card">
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
                    on:click={() => (showDeleteConfirmation = true)}
                    >Delete Account</Button
                >
            </div>
        </FieldSet>
    </div>
</div>

<MessageDialogue
    bind:show={showMessage}
    title={messageTitle}
    message={messageContent}
    buttonText="OK"
/>

<ActionDialogue
    bind:show={showLockConfirmation}
    title="Lock Account"
    message="Your account will be completely unusable after you lock it. You will be signed out of Dash from all devices."
    txtColor="warning"
    actionBtnColor="warning"
    actionButtonText="Lock Account"
    action={() => {
        fetch(`/api/account/lock`, {
            method: "POST",
            headers: {
                "X-Dash-SessionId": sessionId,
            },
        }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
                goto(res.goto);
            } else {
                messageTitle = "Lock Account Failed";
                messageContent =
                    "Failed to lock account. Reason: " + res.reason;
                showMessage = true;
                //throw `Failed to lock account: ${await r.text()}`;
            }
        });
    }}
/>

<ActionDialogue
    bind:show={showDeleteConfirmation}
    title="Delete Account"
    actionBtnColor="error"
    actionButtonText="Delete Account"
    action={() => {
        if (deleteConfirmationInput === userId) {
            fetch(`/api/account/delete`, {
                method: "POST",
                headers: {
                    "X-Dash-SessionId": sessionId,
                },
            }).then(async (r) => {
                const res = await r.json();
                if (r.status === 200) {
                    goto(res.goto);
                } else {
                    messageTitle = "Delete Account Failed";
                    messageContent =
                        "Failed to delete account. Reason: " + res.reason;
                    showMessage = true;
                    //throw `Failed to delete account: ${await r.text()}`;
                }
            });
        } else {
            setTimeout(() => (showDeleteConfirmation = true), 100);
        }
    }}
>
    <Text color="error" align="center">
        Type <Text b blockquote class="select-none">{userId}</Text> to delete your
        account.
    </Text>
    <Spacer h={10} />
    <Input
        placeholder={userId}
        bind:value={deleteConfirmationInput}
        width="100%"
        size="base"
    />
</ActionDialogue>
