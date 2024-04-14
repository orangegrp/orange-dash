<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        Text,
        Note,
        Spacer,
        Button,
    } from "geist-ui-svelte";
    import ProcessDialogue from "../../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../../components/Spinner.svelte";

    let showProcessMessage = false;
    let sessionId = "";
    let isIFrame = false;
    
    let showContentPage = false;
    let showQuizPage = false;
    
    onMount(() => {
        sessionId = $page.data.session_id;
        isIFrame = window.frameElement !== null
    });

    import MessageDialogue from "../../../components/dialogue/MessageDialogue.svelte";
         
    let showMessage = false;
    let messageTitle = "";
    let messageContent = ""; 

    import ContentForm from "./forms/content-form.svelte";
    import QuestionForm from "./forms/question-form.svelte";
</script>

<MessageDialogue
    bind:show={showMessage}
    title={messageTitle}
    message={messageContent}
    buttonText="OK"
/>

{#if !isIFrame}
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
                    StudyBot™ Content Manager is a Dash applet that is only
                    available through Dash. Please open this applet inside the
                    Dash application.
                </div>
            </div>
        </Note>
    </div>
{:else}
    <main>
        <Text type="h3" class="font-light mb-4">Content Manager</Text>
        <Note color="success" label={false}>
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
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                </svg>
                <Text
                    >This applet is in beta, some features may not be available
                    yet or work correctly.</Text
                >
            </div>
        </Note>

        <div class="my-4 gap-y-2 flex flex-col">
            <div class="flex flex-row gap-x-2">
                <Button on:click={() => (showContentPage = true)}
                    >Add new study content</Button
                >
                <Button on:click={() => (showQuizPage = true)}
                    >Add new quiz question</Button
                >
            </div>
            <Text color="secondary" size="sm"
                >To delete a piece of content, please contact a Dash
                administrator.</Text
            >
        </div>

        <ContentForm bind:showPage={showContentPage} bind:messageContent bind:messageTitle bind:showMessage />
        <QuestionForm bind:showPage={showQuizPage} bind:messageContent bind:messageTitle bind:showMessage />

        <ProcessDialogue
            bind:show={showProcessMessage}
            message="Submitting content"
        >
            <Text size="sm" color="secondary"
                >This can take a few seconds. <Text color="dark" b
                    >Do not reload the page.</Text
                ></Text
            >
            <Spacer h={15} />
            <Spinner />
        </ProcessDialogue>
    </main>
{/if}