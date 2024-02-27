<script lang="ts">
    import MFAForm from "../../components/MFAForm.svelte";
</script>

<main
    class="flex w-full items-center login-container-min-height justify-center"
>
    <div class="dark:bg-black bg-gray-50 shadow-lg rounded-xl md:rounded-3xl">
        <MFAForm />
    </div>
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
</style>