<script lang="ts">
    import { onMount } from "svelte";
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import {
        Text,
        Note,
        Spacer,
        Card,
        Center,
        Button,
        Page,
    } from "geist-ui-svelte";
    import ProcessDialogue from "../../../components/dialogue/ProcessDialogue.svelte";
    import Spinner from "../../../components/Spinner.svelte";

    let showProcessMessage = false;
    let sessionId = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/studybot/studycontent");
        sessionId = $page.data.session_id;
    });

    import { tipexEditor, Tipex } from "@friendofsvelte/tipex";

    let showPage = false;

    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import ContentEntryText from "../components/ContentEntryText.svelte";

    let category = "";
    let title = "";
    let icon = "";
    let image = "";
    let link = "";
    let footer = "";
    let sequence = "";
</script>

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
                >This applet is in beta, some features may not be available yet
                or work correctly.</Text
            >
        </div>
    </Note>

    <div class="my-4 gap-y-2 flex flex-col">
        <Button on:click={() => (showPage = true)}>Add new content entry</Button
        >
        <Text color="secondary" size="sm"
            >To delete a piece of content, please contact a Dash administrator.</Text
        >
    </div>

    <Page bind:visible={showPage}>
        <div class="mt-16 max-h-[90vh] overflow-y-scroll">
            <Center class="h-full w-full mb-32">
                <Button size="xs" on:click={() => (showPage = false)}>
                    Click here or press <div
                        class="bg-gray-900 mx-2 rounded-md px-2 flex flex-row gap-x-1.5 place-items-center"
                    >
                        <span class="font-mono font-bold">Esc</span>
                    </div>
                    to exit
                </Button>
                <Text type="h3" class="font-light my-4"
                    >Content Submission Form</Text
                >
                <div class="max-w-2xl mb-4 px-2">
                    <Note color="default" label={false}>
                        <div class="flex flex-row place-items-center gap-x-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="min-w-5 min-h-5 w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                                />
                            </svg>

                            <Text size="xs">
                                The content you enter into this form will be
                                used in the StudyBot "study" feature. By
                                submitting content, you consent to its use by
                                orange Bot and its develoeprs and affirm that it
                                is of good quality. If the content is found to
                                be inappropriate, or of poor quality, you
                                understand that your further access to this
                                applet may be impeded.
                            </Text>
                        </div>
                    </Note>
                </div>
                <div
                    class="flex flex-col mt-4 w-full max-w-3xl px-2 gap-y-2 flex-grow flex-shrink"
                    style="flex-basis: 100%;"
                >
                    <ContentEntryText
                        name="Category"
                        bind:value={category}
                        guidanceText="The category name should be simple and concise but also specific to
                    the topic or subtopic if the topic is large e.g. CCNA-1, CCNA-2,
                    etc."
                    />
                    <ContentEntryText
                        name="Title"
                        bind:value={title}
                        guidanceText="The title should include the name of the topic and the subtopic. e.g. CCNA-1 - Routing and Switching."
                    />
                    <ContentEntryText
                        name="Icon Url"
                        bind:value={icon}
                        guidanceText="(Optional) You can include a permanent link to an image to accompany the content. This shows up in the top-right corner of the Discord embed as a small icon."
                    />
                    <ContentEntryText
                        name="Image Url"
                        bind:value={image}
                        guidanceText="(Optional) You can include a permanent link to an image to accompany the content. This shows up as the main image of the embed in Discord."
                    />
                    <ContentEntryText
                        name="Link"
                        bind:value={link}
                        guidanceText="(Optional) You can include a link to a third website for additioonal information."
                    />
                    <ContentEntryText
                        name="Footer Text"
                        bind:value={footer}
                        guidanceText="(Optional) Additional information about the content or topic. Useful if the subject name is too long, or you want to include references."
                    />
                    <ContentEntryText
                        name="Sequence Number"
                        bind:value={sequence}
                        guidanceText="This is the position of this slide in the slideshow. The sequence should start at 1. If you need to edit a sequence number, please contact a Dash admin as this feature isn't available yet."
                    />
                    <div class="flex flex-col my-2 gap-y-2">
                        <Text>Content:</Text>
                        <Card class="flex flex-col p-2 w-full">
                            <div
                                class="flex flex-row place-items-center gap-x-1 w-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                    />
                                </svg>
                                <Text size="xs" b>GUIDANCE</Text>
                            </div>
                            <Text size="xs" color="secondary">
                                The content of the slide should go here. Images
                                linked here will not be embedded by Discord.
                                Avoid using special formatting as this field is
                                interpreted as RICH TEXT and then converted to
                                markdown when rendering to Discord.
                            </Text>
                        </Card>
                        <Tipex
                            displayDefaultControls
                            floatingMenu
                            className="h-[50vh] border border-gray-800"
                        />
                    </div>
                </div>
                <div class="flex flex-row gap-x-2 mt-4 justify-between">
                    <Button
                        color="success"
                        on:click={() => {
                            showPage = false;
                            showProcessMessage = true;

                            fetch(`/api/studybot/contentsubmit`, {
                                method: "POST",
                                headers: {
                                    "X-Dash-SessionId": sessionId,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    category,
                                    title,
                                    icon,
                                    image,
                                    link,
                                    footer,
                                    sequence,
                                    content: $tipexEditor.getHTML()
                                })
                            }).then(async (r) => {
                                const res = await r.json();
                                if (r.status === 200) {
                                    showProcessMessage = false;
                                }
                            });
                        }}
                    >
                        Submit Content
                    </Button>
                    <Button
                        color="error"
                        on:click={() => {
                            window.location.reload();
                        }}
                    >
                        Cancel Submission
                    </Button>
                </div>
            </Center>
        </div>
    </Page>

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
