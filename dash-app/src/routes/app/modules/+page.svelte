<script>
    import { onMount } from "svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/modules");
    });
</script>

2