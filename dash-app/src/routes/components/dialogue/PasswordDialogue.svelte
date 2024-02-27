<script lang="ts">
    import ActionDialogue from "./ActionDialogue.svelte";
    import z from "zxcvbn";
    import { Text, Spacer, Input } from "geist-ui-svelte";

    export let show: boolean = false;
    export let mode: "confirm" | "set" | "change" = "confirm";
    export let oldPassword: string = "";
    export let password: string = "";
    export let nonaction: (e: MouseEvent) => void = () => {};
    export let action: (
        e: MouseEvent,
        password: string,
        oldpw?: string,
    ) => void = () => {};

    let passwordInput1 = "";
    let passwordInput2 = "";
    let passwordError = 0;

    $: passwordScore = z(passwordInput1).score;

    function checkPasswords() {
        if (passwordInput1 !== passwordInput2) {
            passwordError = 1;
            return false;
        } else if (passwordInput1 === "") {
            passwordError = 2;
            return false;
        } else if (passwordInput1.length < 10) {
            passwordError = 3;
            return false;
        } else if (passwordScore < 3) {
            passwordError = 4;
            return false;
        }

        return true;
    }
</script>

<ActionDialogue
    bind:show
    title={mode === "change"
        ? "Change Password"
        : mode === "set"
          ? "Set a Password"
          : "Confirm Password"}
    message={mode === "confirm"
        ? "Please enter your password to continue."
        : "Your password must be at least 10 characters."}
    actionBtnColor="success"
    actionButtonText={mode === "change"
        ? "Change Password"
        : mode === "set"
          ? "Set Password"
          : "Confirm Password"}
    nonaction={(e) => {
        passwordError = 0;
        password = "";
        oldPassword = "";
        passwordInput1 = "";
        passwordInput2 = "";
        nonaction(e);
    }}
    action={(e) => {
        if (mode !== "confirm" && !checkPasswords()) {
            setTimeout(() => (show = true), 100);
            return;
        }
        password = passwordInput1;
        action(e, passwordInput1);
    }}
>
    <Spacer h={5} />

    {#if mode === "confirm"}
        <div class="w-full">
            <Input
                bind:value={passwordInput1}
                type="password"
                width="100%"
                placeholder="Confirm Password"
                size="base"
            >
                Confirm Password
            </Input>
            <Spacer h={5} />
        </div>
    {:else}
        <p class="leading-none">
            {#if passwordError === 1}
                <Text color="error" size="xs" align="center">
                    Passwords do not match. Please check the password and try
                    again.
                </Text>
            {:else if passwordError === 2}
                <Text color="error" size="xs" align="center">
                    Password cannot be empty. Are you asking to get hacked or
                    what?
                </Text>
            {:else if passwordError === 3}
                <Text color="error" size="xs" align="center">
                    Password must be at least 10 characters long.
                </Text>
            {:else if passwordError === 4}
                <Text color="error" size="xs" align="center">
                    Password is not secure enough. Use a more complex password.
                </Text>
            {:else}
                <Text color="success" size="xs" align="center">
                    Passwords are encrypted in transit and represented using
                    secure hashing algorithms.
                    <a
                        class="underline text-xs"
                        href="https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/"
                    >
                        Learn more.
                    </a>
                </Text>
            {/if}
        </p>
        <Spacer h={5} />
        <div class="w-full">
            {#if mode === "change"}
                <Input
                    bind:value={oldPassword}
                    type="password"
                    width="100%"
                    placeholder="Old Password"
                    size="base">Old Password</Input
                >
                <Spacer h={5} />
            {/if}

            <Input
                bind:value={passwordInput1}
                type="password"
                width="100%"
                placeholder="New Password"
                size="base"
            >
                New Password
            </Input>
            {#if passwordInput1.length > 0}
                <div class="w-full flex justify-end mt-1">
                    <Text
                        size="xs"
                        color={passwordScore > 3 ? "success" : "error"}
                    >
                        {passwordScore > 3
                            ? "Nice one. Your password is secure"
                            : "Weak password. Keep typing"}
                    </Text>
                </div>
            {/if}
            <Spacer h={5} />
            <Input
                bind:value={passwordInput2}
                type="password"
                width="100%"
                placeholder="Confirm Password"
                size="base">Confirm Password</Input
            >
        </div>
    {/if}
</ActionDialogue>
