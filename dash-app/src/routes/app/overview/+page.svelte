<script>
    import { onMount } from "svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/overview");
    });
</script>

0