<script lang="ts">
    import { Loading, Center } from "geist-ui-svelte";
    import Icon from "../components/Icon.svelte";
    import { onMount } from "svelte";
    import Orange3DIcon from "$lib/images/orange-3d.png";

    type RedirectTarget = "app" | "login" | "error" | "logout" | "login/mfa";
    function isValidRedirectTarget(target: string): target is RedirectTarget {
        return (
            target === "app" ||
            target === "login" ||
            target.startsWith("error") ||
            target === "logout" ||
            target === "login/mfa"
        );
    }

    onMount(() => {
        const target = new URLSearchParams(window.location.search).get(
            "target",
        );
        const validTarget = isValidRedirectTarget(target) ? target : "app";

        setTimeout(() => {
            window.location.href = "/" + validTarget;
        }, 1500); // give server time to update
    });
</script>

<main
    class="flex w-full flex-col items-center login-container-min-height justify-center"
>
    <div class="bg-shadow" />
    <img
        src={Orange3DIcon}
        class="ml-5 animate orange-animation animate-pulse"
        alt="Orange Logo"
        width="200"
        height="200"
    />
</main>

<style>
    .login-container-min-height {
        min-height: calc(85vh - 60px);
    }
    main {
        background-image: radial-gradient(
            rgb(128, 128, 128, 0.1) 1px,
            transparent 0
        );
        background-size: 10px 10px;
        background-position: -16px -32px;
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

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
            transform: none;
            opacity: 0.25;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }
    .orange-animation {
        animation: bounce 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
