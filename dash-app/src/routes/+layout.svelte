<script lang="ts">
	import "geist-ui-svelte/styles/geist-ui-svelte.css";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import { page } from "$app/stores";

	import {
		Header,
		LightSwitch,
		Details,
		Center,
		Text,
		Note,
		Avatar,
		Divider,
		Dropdown,
		Spacer,
		Button,
	} from "geist-ui-svelte";
	import Icon from "./components/Icon.svelte";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import ActionDialogue from "./components/dialogue/ActionDialogue.svelte";

	let diagnosticString = writable<string[]>([]);
	let profilePopup = false;
	let showLogoutConfirmation = false;

	function changeBackground(elem_id: string) {
		const parent = document.getElementById(elem_id);
		const target = parent.childNodes[0];
		(target as HTMLElement).classList.add("dark:bg-gray-975/80");
		(target as HTMLElement).classList.add("backdrop-blur-lg");
		(target as HTMLElement).classList.remove("dark:bg-gray-999");
	}

	onMount(async () => {
		if ($page.url.pathname.startsWith("/app"))
			changeBackground("header-parent");

		const diagnosticData = await (await fetch("/api/diagnostics")).json();

		const newDiagnostics = [
			`Request ID: &nbsp; <code>${diagnosticData.requestId}</code>`,
			`Your IP Address: &nbsp; <code>${diagnosticData.clientIp}</code>`,
			`Platform: &nbsp; <code>${diagnosticData.clientPlatform}</code>`,
			`User Agent: &nbsp; <code>${diagnosticData.clientUa}</code>`,
		];

		diagnosticString.set([...$diagnosticString, ...newDiagnostics]);

		const dev_message =
			"========================================\nSTOP AND READ THIS BEFORE YOU CONTINUE !!!\n========================================\n\n" +
			"If anyone asked you to open your browser's DevTools, they are probably trying to steal your session cookie and " +
			"hijack your Dash account. Only continue if you know what you're doing and are doing it off of your own " +
			"accord.\n\nTHE DEVTOOLS WINDOW MAY CONTAIN SENSITIVE LOGIN CREDENTIALS, IT IS ADVISED THAT YOU TURN OFF ANY " +
			"SCREEN CAPTURE OR SHARING SOFTWARE BEFORE YOU PROCEED. FOR YOUR SECURITY, DO NOT SHARE THESE WITH ANYONE.";

		
		// https://jsbin.com/cateqeyono/edit?html,output
		console.log(
			Object.defineProperties(new Error(), {
				toString: {
					value() {
						console.clear();
						console.log(
							`%c${dev_message}`,
							"background: red; color: yellow; font-size: x-large",
						);
						setInterval(
							() =>
								console.log(
									`%c${dev_message}`,
									"background: red; color: yellow; font-size: x-large",
								),
							3000,
						);

						new Error().stack.includes("toString@") &&
							alert(dev_message);
					},
				},
				message: {
					get() {
						console.clear();
						console.log(
							`%c${dev_message}`,
							"background: red; color: yellow; font-size: x-large",
						);
						setInterval(
							() =>
								console.log(
									`%c${dev_message}`,
									"background: red; color: yellow; font-size: x-large",
								),
							3000,
						);

						alert(dev_message);
					},
				},
			}),
		);
		
	});
</script>

<ModeWatcher defaultMode="dark" />

<ActionDialogue
	bind:show={showLogoutConfirmation}
	title="Log Out"
	message="You will be signed out of Dash on this device."
	href="/logout"
	actionBtnColor="secondary"
	actionButtonText="Log Out"
/>

<body class="dark:bg-black bg-gray-50 mb-4">
	<div
		id="header-parent"
		style="position: sticky !important; z-index: 2 !important;"
	>
		<Header
			noBorder={$page.url.pathname.startsWith("/app") && !$page.url.pathname.startsWith("/app/account") ? true : false}
			transparent={true}
		>
			<div
				class="flex place-items-center justify-between w-full py-1 px-4 md:py-2 sm:px-8"
			>
				<div class="flex flex-row gap-x-3 select-none">
					<Icon
						dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
						light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
						width="48"
						height="48"
						alt="Logo"
					/>
					<strong translate="no">Dash</strong>
				</div>

				{#if $page.data.session}
					<button
						on:click={() => (profilePopup = !profilePopup)}
						class="flex place-items-center justify-center"
						id="avatar-button"
					>
						<Avatar name={$page.data.session.dash_id} />
					</button>

					<Dropdown
						anchor="#avatar-button"
						shadow
						bind:visible={profilePopup}
						placement="bottom"
						offset={{ x: 0, y: 8 }}
						class="w-fit"
					>
						<div class="flex flex-col p-4">
							<Text size="xs" color="secondary">
								Dash ID:
								<Text class="font-mono">
									{$page.data.session.dash_id}
								</Text>
							</Text>
							<Spacer h={10} />
							<Divider />
							<Spacer h={10} />
							<a
								class="text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
							hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all"
								href="/app/account"
								target="_blank"
								>Account Settings</a
							>
							<Spacer h={10} />
							<button
								class="text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
							hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all"
								on:click={() => (showLogoutConfirmation = true)}
								>Log Out</button
							>
						</div>
					</Dropdown>
				{/if}
			</div>
		</Header>
	</div>
	<slot />
</body>

<Center>
	<Details label="Diagnostic Information">
		<ul class="mb-10">
			{#each $diagnosticString as diagnostic}
				<li class="list-disc ml-10">
					<Text type="small">{@html diagnostic}</Text>
				</li>
			{/each}
		</ul>
	</Details>
</Center>

<style>
	body {
		font-family: "Circular Std", "Inter", sans-serif;
	}
</style>
