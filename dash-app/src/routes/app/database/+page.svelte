<script>
    import { onMount } from "svelte";

    onMount(() => {
        window.history.replaceState({}, "", "/app/database");
    });
</script>

<main>
    <iframe title="Pocketbase" class="w-screen h-[80vh]" src="https://pocketbase-aci1.vcn1.order332.com/_/"/>
</main>