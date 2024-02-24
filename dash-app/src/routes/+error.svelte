<script lang="ts">
    import { Note, Text } from "geist-ui-svelte";
    import { page } from "$app/stores";

    let color: "default" | "success" | "warning" | "error" | "secondary" =
        "error";

    switch ($page.status.toString()[0]) {
        case "4":
            color = "warning";
            break;
        case "5":
            color = "error";
            break;
        case "1":
        case "2":
        case "3":
        default:
            color = "default";
            break;
    }
</script>

<main
    class="flex w-full items-center container-min-height justify-center dark:bg-black bg-gray-50"
>
    <Note {color}>
        <Text slot="label" b>{$page.status}</Text>
        {$page.error?.message}
    </Note>
</main>

<style>
    .container-min-height {
        min-height: calc(85vh - 60px);
    }
    main {
        background-image: radial-gradient(
            rgb(128, 128, 128, 0.1) 1px,
            transparent 0
        );
        background-size: 10px 10px;
        background-position: -16px -32px;
    }
</style>
