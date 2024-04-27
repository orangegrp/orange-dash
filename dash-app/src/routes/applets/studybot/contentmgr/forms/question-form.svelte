<script lang="ts">
    import { Text, Note, Card, Center, Button, Page } from "geist-ui-svelte";

    let showProcessMessage = false;
    let sessionId = "";

    import { page } from "$app/stores";

    onMount(() => {
        sessionId = $page.data.session_id;
    });

    import { tipexEditor, Tipex } from "@friendofsvelte/tipex";

    export let showMessage = false;
    export let messageTitle = "";
    export let messageContent = "";
    export let showPage = false;

    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import ContentEntryText from "../../components/ContentEntryText.svelte";
    import EmbedPreviewer from "../../components/EmbedPreviewer.svelte";

    let htmlContent1 = "Write something ...";
    let htmlContent2 = "Write something ...";
    let category = "";
    let question = "";
    let icon = "";
    let image = "";
    let link = "";
    let footer = "";
    let answer = "";
    let choices = "";

    import TurndownService from "turndown";
    import { onMount } from "svelte";
    const turndownservice = new TurndownService();

    $: embed1 = {
        embed: {
            url: link.length === 0 ? undefined : link,
            author: category.length === 0 ? undefined : { name: category },
            title: question.length === 0 ? undefined : question,
            description:
                htmlContent1.length === 0
                    ? "Write something ..."
                    : turndownservice.turndown(htmlContent1),
            thumbnail: icon.length === 0 ? undefined : { url: icon },
            image: image.length === 0 ? undefined : { url: image },
            footer: { text: `Slide ${answer} of N ${footer}` },
        },
    };

    $: embed2 = {
        embed: {
            url: link.length === 0 ? undefined : link,
            author: category.length === 0 ? undefined : { name: category },
            title: question.length === 0 ? undefined : question,
            description:
                htmlContent2.length === 0
                    ? "Write something ..."
                    : turndownservice.turndown(htmlContent2),
            thumbnail: icon.length === 0 ? undefined : { url: icon },
            image: image.length === 0 ? undefined : { url: image },
            footer: { text: `Slide ${answer} of N ${footer}` },
        },
    };
</script>

<Page bind:visible={showPage}>
    <div class="max-h-[100vh] overflow-y-scroll">
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
                >Quiz Question Submission Form</Text
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
                            The quiz data you enter into this form will be used
                            in the StudyBot "quiz" feature. By submitting quiz
                            data, you consent to its use by orange Bot and its
                            develoeprs and affirm that it is of good quality. If
                            the quiz data is found to be inappropriate, or of
                            poor quality, you understand that your further
                            access to this applet may be impeded.
                        </Text>
                    </div>
                </Note>
            </div>
            <div class="max-w-7xl">
                <div class="flex flex-col xl:flex-row w-screen gap-x-2">
                    <div
                        style="flex-basis: 100%;"
                        class="flex flex-col flex-grow flex-shrink mt-4 w-full max-w-2xl px-2 gap-y-2"
                    >
                        <ContentEntryText
                            name="Category"
                            bind:value={category}
                            guidanceText="The category name should be simple and concise but also specific to
                the topic or subtopic if the topic is large e.g. CCNA-1, CCNA-2,
                etc."
                        />
                        <ContentEntryText
                            name="Question"
                            bind:value={question}
                            guidanceText="The question to be answered."
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
                            name="Choices"
                            bind:value={choices}
                            guidanceText="Comma seperated list of choices (can be letters or numbers e.g.) A,B,C,D,E or 1,2,3,4,5 or i,ii,iii,iv,v etc"
                        />
                        <ContentEntryText
                            name="Answer"
                            bind:value={answer}
                            guidanceText="The correct choice of answer (or multiple) e.g. A or A,C"
                        />
                    </div>
                    <div class="flex flex-col p-2 lg:w-1/3 my-2 gap-y-2">
                        <div class="flex flex-col gap-y-2 my-2">
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
                                    The main content of the question should go
                                    here. Images linked here will not be
                                    embedded by Discord. Avoid using special
                                    formatting as this field is interpreted as
                                    RICH TEXT and then converted to markdown
                                    when rendering to Discord.
                                </Text>
                            </Card>
                            <Tipex
                                onEditorUpdate={(e) => {
                                    htmlContent1 = e.editor.getHTML();
                                }}
                                displayDefaultControls
                                floatingMenu
                                className="h-[50vh] border border-gray-800"
                            />
                            <div class="flex flex-col my-2 gap-y-2 p-0">
                                <Text>Preview the question:</Text>
                                <Text size="xs" color="secondary"
                                    >Please note the renderer uses the old
                                    Discord markdown spec which does not
                                    inlclude headings, links, etc. Rest assured
                                    they will appear on Discord, just not in
                                    this preview window.</Text
                                >
                                <EmbedPreviewer bind:embedObject={embed1} />
                            </div>
                        </div>
                        <div class="flex flex-col gap-y-2 my-2">
                            <Text>Explanation:</Text>
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
                                    The content of the explanations slide should
                                    go here. This will be shown if the user gets
                                    the question wrong. Images linked here will
                                    not be embedded by Discord. Avoid using
                                    special formatting as this field is
                                    interpreted as RICH TEXT and then converted
                                    to markdown when rendering to Discord.
                                </Text>
                            </Card>
                            <Tipex
                                onEditorUpdate={(e) => {
                                    htmlContent2 = e.editor.getHTML();
                                }}
                                displayDefaultControls
                                floatingMenu
                                className="h-[50vh] border border-gray-800"
                            />
                            <div class="flex flex-col my-2 gap-y-2 p-0">
                                <Text>Preview the explanation slide:</Text>
                                <Text size="xs" color="secondary"
                                    >Please note the renderer uses the old
                                    Discord markdown spec which does not
                                    inlclude headings, links, etc. Rest assured
                                    they will appear on Discord, just not in
                                    this preview window.</Text
                                >
                                <EmbedPreviewer bind:embedObject={embed2} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-x-2 mt-4 justify-between">
                <Button
                    color="success"
                    on:click={() => {
                        showPage = false;
                        showProcessMessage = true;

                        console.log(htmlContent1);
                        console.log(htmlContent2);

                        fetch(`/api/studybot/questionsubmit`, {
                            method: "POST",
                            headers: {
                                "X-Dash-SessionId": sessionId,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                category,
                                question,
                                icon,
                                image,
                                link,
                                footer,
                                answer,
                                choices,
                                content: htmlContent1,
                                explanation: htmlContent2,
                            }),
                        }).then(async (r) => {
                            const res = await r.json();
                            showProcessMessage = false;
                            if (r.status === 200) {
                                messageTitle = "Quiz Question Submitted";
                                messageContent = "Thanks for contributing!";
                                showMessage = true;
                            } else {
                                messageTitle =
                                    "Quiz Question Submission Failed";
                                messageContent =
                                    "Something went wrong. Reason: " +
                                    res.reason +
                                    " Please check the form for any mistakes such as malformed links, invalid characters or empty fields which are required.";

                                showMessage = true;
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
