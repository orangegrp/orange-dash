<script>
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/deployment");
    });
</script>

<AppHeader Title="Deployment">
    
</AppHeader>
<AppContent>
        
</AppContent>
1