<script lang="ts">
    import { Text, Card } from "geist-ui-svelte";
    import TextInput from "../../../components/TextInput.svelte";

    export let name = "";
    export let guidanceText="";
    export let value = "";
</script>

<div class="flex flex-col sm:flex-row gap-x-4 gap-y-2 place-items-start w-full justify-between">
    <div class="flex flex-row place-items-center gap-x-2 w-full justify-between text-nowrap max-w-96">
        <Text>{name}:</Text>
        <TextInput bind:value={value} class="w-fit" />
    </div>
    <Card class="flex flex-col p-2 w-[30rem]">
        <div class="flex flex-row place-items-center gap-x-1 w-full">
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
            {guidanceText}
            <!--
                The category name should be simple and concise but also specific to
            the topic or subtopic if the topic is large e.g. CCNA-1, CCNA-2,
            etc.
            -->
        </Text>
    </Card>
</div>
