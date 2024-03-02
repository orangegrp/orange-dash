<script>
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/modules");
    });
</script>

<AppHeader Title="Modules">
</AppHeader>

<AppContent>
        
</AppContent>
2