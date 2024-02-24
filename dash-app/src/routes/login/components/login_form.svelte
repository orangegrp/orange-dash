<script lang="ts">
    import {
        Input,
        Text,
        Spacer,
        Checkbox,
        Button,
        Divider,
        Center,
        Key,
    } from "geist-ui-svelte";
    import Icon from "../../components/Icon.svelte";
    import { Modal } from "geist-ui-svelte";

    let showForgotPassword: boolean = false;
</script>

<div
    class="flex justify-between border-gray-150
    dark:border-gray-900 py-6 border max-w-[320px] sm:max-w-[480px] w-full
    md:max-w-[900px] h-96 px-4 sm:px-8 rounded-xl md:rounded-3xl" 
>
    <form
        action=""
        on:submit|preventDefault
        class="flex-grow w-screen md:w-full flex flex-col place-items-start justify-center"
    >
        <div class="flex flex-row gap-x-2 mb-2">
            <Icon
                dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
                light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
                width="32"
                height="32"
                alt="Logo"
            />
            <strong> orange Dash Account </strong>
        </div>
        <Input type="text" placeholder="Username" width="100%">
            <Text type="small">Username</Text>
        </Input>
        <Spacer h={5} />
        <Input type="password" placeholder="Password" width="100%">
            <Text type="small" color="secondary">Password</Text>
        </Input>
        <Spacer h={15} />
        <div class="flex place-items-center justify-between w-full">
            <Checkbox ring color="success">
                <Text type="small" color="secondary">Remember me</Text>
            </Checkbox>
            <Text type="small">
                <button on:click={() => (showForgotPassword = true)}
                    >Forgot password?</button
                >
            </Text>
        </div>
        <Spacer h={15} />
        <Button type="submit" width="100%" color="success-light"
            >Continue
            <Spacer w={10} />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
            </svg>
        </Button>
        <Spacer h={30} />
        <Divider label="Or continue with" />
        <Spacer h={10} />
        <div class="flex place-items-center w-full gap-2">
            <Button
                width="100%"
                on:click={async () => {
                    const oauth2_url =
                        "https://discord.com/oauth2/authorize?client_id=1210923470620463164&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin%2Foauth2%2Fdiscord&scope=identify+guilds";
                    window.location.href = oauth2_url;
                }}
            >
                <div class="flex place-items-center gap-2">
                    <Icon
                        dark="https://assets-global.website-files.com/6257adef93867e50d84d30e2/653714c1f22aef3b6921d63d_636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                        light="https://assets-global.website-files.com/6257adef93867e50d84d30e2/653714c17467993e7b389c83_636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
                        width="16"
                        height="16"
                        alt="Discord"
                    />
                    Discord
                </div>
            </Button>
        </div>
    </form>
    <div class="md:flex w-full flex-grow hidden">
        <Spacer w={75} />
        <Divider vertical width="1px" />
        <Spacer w={75} />
        <Center class="flex-grow w-full flex flex-col gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
            </svg>

            <Text type="h1" align="center" size="sm"
                >Authentication required in order to continue</Text
            >
        </Center>
    </div>
</div>

<Modal bind:visible={showForgotPassword} class="sm:w-[640px]">
    <div
        class="p-4 flex flex-col place-items-center
	 justify-center h-full"
    >
        <Text type="h6" align="center">Account Recovery</Text>
        <Text align="center">
            Please contact a Dash administrator to regain access to your
            account.
        </Text>
        <Spacer h={20} />
        <Text align="center" color="secondary" type="small">
            Click anywhere outside this message or press the <Key>Esc</Key> key to
            dismiss this message.
        </Text>
    </div>
</Modal>
