<script lang="ts">
    import { writable } from "svelte/store";

    export let mfa_form: HTMLFormElement = null;
    export let buttonLoading: boolean = false;
    export let otp = ["", "", "", "", "", ""];

    function focusNext(event, index) {
        if (index === 5) {
            buttonLoading = true;
            if (mfa_form) mfa_form.submit();
        }

        if (event.target.value.length >= 1) {
            event.target.nextElementSibling.focus();
            buttonLoading = false;
        }
    }

    function handleBackspace(event, index) {
        if (event.key === "Backspace" && event.target.value === "") {
            event.target.previousElementSibling.focus();
            buttonLoading = false;
        }
    }

    function handlePaste(event, index) {
        event.preventDefault();

        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData("text");

        const otp_numbers = (pastedData as string).split("").slice(0, 6);
        otp = otp_numbers;

        if (otp_numbers.length === 6) {
            buttonLoading = true;
            setTimeout(() => {
                if (mfa_form) mfa_form.submit();
            }, 1000);
        }
    }
</script>

{#each otp as digit, index}
    <input
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        inputmode="numeric"
        autocomplete="one-time-code"
        type="tel"
        id="totp_{index}"
        name="totp_{index}"
        maxlength="1"
        class="text-center otp-input bg-transparent order-3 min-w-0 text-gray-900 dark:text-gray-100 border dark:border-gray-900 rounded-lg"
        bind:value={otp[index]}
        on:keydown={(event) => handleBackspace(event, index)}
        on:input={(event) => focusNext(event, index)}
        on:paste={(event) => handlePaste(event, index)}
    />
{/each}

<style>
    .otp-input {
        width: 36px;
        height: 36px;
        text-align: center;
        outline: none;
        margin-right: 5px;
    }
</style>
