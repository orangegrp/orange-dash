<script lang="ts">
    import { resolveRoute } from "$app/paths";
    import { page } from "$app/stores";
    import { Button, Center, Text } from "geist-ui-svelte";
    import { Html5Qrcode } from "html5-qrcode";
    import { onMount } from "svelte";

    export let scanning = false;
    export let notdone = false;

    let error = false;

    let html5Qrcode;

    onMount(init);

    function init() {
        html5Qrcode = new Html5Qrcode("reader");
    }

    function start() {
        html5Qrcode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            onScanSuccess,
            onScanFailure,
        );
        scanning = true;
    }

    async function stop() {
        await html5Qrcode.stop();
        scanning = false;
    }

    function onScanSuccess(decodedText, decodedResult) {
        const segments = decodedText.split(",");
        fetch(`/login/qrcode`, {
            method: "POST",
            headers: {
                "X-Dash-SessionId": $page.data.session_id,
                "X-Dash-QrCode": segments[1],
                "X-Dash-LoginId": segments[0],
            },
        }).then(async (r) => {
            const res = await r.text();
            //alert(`${r.status} - ${res} - ${decodedText}`);
            if (r.status === 200) {
                stop();
                notdone = false;
            } else {
                if (error === false) {
                    error = true;
                setTimeout(() => {
                    error = false;
                }, 1000);
                }

    
            }
        });

        //alert(`Code matched = ${decodedText}`);
        console.log(decodedResult);
    }

    function onScanFailure(error) {
        console.warn(`Code scan error = ${error}`);
    }
</script>

<main>
    {#if error}
        <Text
            color="error"
            size="xs"
            class="flex flex-row gap-x-1 items-center justify-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
            </svg>

            Invalid or expired QR code.</Text
        >
    {:else}
        <Text
            color="secondary"
            size="xs"
            class="flex flex-row gap-x-1 items-center justify-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
            </svg>

            Image data is processed on-device.</Text
        >
    {/if}
    <reader id="reader" />
    {#if scanning}
        <Button type="button" color="error" on:click={stop}
            >Stop Device Camera</Button
        >
    {:else}
        <Button type="button" color="secondary" on:click={start}
            >Enable Device Camera</Button
        >
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
    }
    reader {
        width: 100%;
        min-height: 0px;
        background-color: transparent;
    }
</style>
