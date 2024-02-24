<script>
    import { onMount } from "svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/account");
    });
</script>

4