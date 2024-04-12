<script lang="ts">
    import { onMount } from "svelte";

    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";

    let allowed = false;
    onMount(() => {
        window.history.replaceState({}, "", "/app/studybot/questions");

        const dashAccount = $page.data.dash_account as DashUser;
        allowed = dashAccount.abac_str.includes("studybot");
    });

    import { Tipex } from "@friendofsvelte/tipex";
    export let htmlContent = "";

    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
</script>

<div class="flex">

</div>