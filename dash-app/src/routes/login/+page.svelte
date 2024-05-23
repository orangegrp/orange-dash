<script lang="ts">
    import LoginForm from "../components/LoginForm.svelte";

</script>

<main
    class="flex w-full items-center login-container-min-height justify-center"
>
    <div class="bg-shadow"/>
    <div class="dark:bg-black bg-gray-50 shadow-lg rounded-xl md:rounded-3xl z-10">
        <LoginForm />
    </div>
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
    .bg-shadow {
        width: 25%;
        height: 1%;
        top: -25%;
        border-radius: 100%;
        left: -12.5%;
        position: absolute;
        z-index: 0;
        box-shadow: 0px 0px 1000px 175px var(--fg-orange);
    }
</style>
