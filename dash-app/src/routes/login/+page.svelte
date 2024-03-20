<script lang="ts">
    import LoginForm from "../components/LoginForm.svelte";

</script>

<main
    class="flex w-full items-center login-container-min-height justify-center"
>
    <div class="dark:bg-black bg-gray-50 shadow-lg rounded-xl md:rounded-3xl">
        <LoginForm />
    </div>
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
</style>
