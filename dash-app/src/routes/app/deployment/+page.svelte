<script>
    import { onMount } from "svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/deployment");
    });
</script>

1