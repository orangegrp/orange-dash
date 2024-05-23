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
		CommandIcon,
		Key,
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
						//console.clear();
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
						//console.clear();
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

	import CommandPalette, {
		defineActions,
		createStoreMethods,
	} from "svelte-command-palette";

	const paletteMethods = createStoreMethods();
	const actions = defineActions([
		{
			title: "Log Out",
			subTitle:
				"Terminate the current Dash session and return to the login page.",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/logout";
			},
			shortcut: "$mod+L",
		},
		{
			title: "Overview",
			subTitle: "System overview",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/overview";
			},
			shortcut: "$mod+1",
		},
		{
			title: "Deployment",
			subTitle: "Deployment configuration",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/deployment";
			},
			shortcut: "$mod+2",
		},
		{
			title: "Modules",
			subTitle: "Configure modules",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/modules";
			},
			shortcut: "$mod+3",
		},
		{
			title: "NotBot™",
			subTitle: "Access the NotBot™ applet",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/notbot";
			},
			shortcut: "$mod+5",
		},
		{
			title: "Audit Log",
			subTitle: "View & manage the audit log",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/admin/audit-log";
			}
		},
		{
			title: "Debug",
			subTitle: "View debug information",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/admin/debug";
			},
			shortcut: "$mod+D",
		},
		{
			title: "Account",
			subTitle: "View general info about your account",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/account";
			},
			shortcut: "$mod+Alt+A",
		},
		{
			title: "Account Security",
			subTitle:
				"View and manage security info about relating to your account",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/account/security";
			}
		},
		{
			title: "Danger Zone",
			subTitle:
				"Lock your account in case it gets compromised or delete it if you no longer want to use it again",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/account/danger-zone";
			}
		},
		{
			title: "StudyBot™",
			subTitle:
				"Access the StudyBot™ applet.",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/studybot";
			},
			shortcut: "$mod+7",
		},
	]);
</script>

<ModeWatcher defaultMode="dark" />

{#if $page.url.pathname.startsWith("/app") && !$page.url.pathname.startsWith("/applets")}
	<CommandPalette
		unstyled={true}
		placeholder="Type a command"
		overlayStyle={{ zIndex: "999" }}
		overlayClass="absolute top-2 w-full bg-transparent"
		paletteWrapperInnerClass="bg-black p-2 w-full border border-gray-900 rounded-lg"
		inputClass="text-gray-900 dark:text-gray-100 border border-gray-900 rounded-lg bg-transparent p-2 h-10 w-full outline-none focus:border-gray-700 focus:shadow-outline-gray"
		resultContainerClass="border border-gray-900 rounded-xl px-4 py-3"
		resultsContainerClass="mt-2 flex flex-col gap-y-2 max-h-[500px] overflow-y-auto pr-4"
		optionSelectedClass="bg-gray-950 text-gray-100"
		titleClass="text-gray-900 text-lg dark:text-gray-100"
		subtitleClass="text-gray-900 mb-1 text-sm dark:text-gray-300"
		descriptionClass="text-gray-900 mb-2 text-xs dark:text-gray-300"
		keyboardButtonClass="bg-gray-950 border rounded-md px-2 py-0 h-8 border-gray-200 border-gray-900"
		commands={actions}
	/>
{/if}

<ActionDialogue
	bind:show={showLogoutConfirmation}
	title="Log Out"
	message="You will be signed out of Dash on this device."
	href="/logout"
	actionBtnColor="secondary"
	actionButtonText="Log Out"
/>

<body class="dark:bg-black bg-gray-50 mb-4">
	{#if !$page.url.pathname.startsWith("/applets")}
	<div
		class="{$page.url.pathname.startsWith("/app") ? "" : "headerparent"}"
		id="header-parent"
		style="position: sticky !important; z-index: 100 !important;"
	>
		<Header
			noBorder={$page.url.pathname.startsWith("/app") &&
			!$page.url.pathname.startsWith("/app/account")
				? true
				: false}
			transparent={true}
		>
			<div
				class="flex place-items-center justify-between w-full py-1 px-4 md:py-2 {$page.url.pathname.startsWith("/app/account") || $page.url.pathname.startsWith('/login') ? "" : "lg:py-0"} sm:px-8"
			>
				<div class="flex flex-row gap-x-3 select-none">
					<Icon
						dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
						light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
						width="48"
						height="48"
						alt="Logo"
					/>
					<span class="inline font-extrabold">
						orange
						<span class="ml-[-2.5px] mr-1" style="color:#ff6723;">
							bot
						</span>
						<span translate="no" class="font-bold">Dash</span>
					</span>

				</div>

				{#if $page.data.session}
					<div
						class="pr-16 py-0 my-0 hidden xl:flex flex-row gap-x-2 place-items-center"
					>
						<button
							on:click={() => paletteMethods.openPalette()}
							class="w-[30rem] my-0 flex justify-center line-clamp-1 dark:!text-gray-600 font-weight-inherit text-inherit dark:text-inherit inherit bg-gray-50 border-gray-100 dark:bg-gray-950 hover:dark:bg-gray-900 active:dark:bg-gray-800 dark:border-gray-900 border px-2 py-1 rounded-md"
						>
							<div
								class="text-sm flex flex-row gap-x-2 py-0.5 place-items-center pb-1"
							>
								Click here or press
								<div
									class="bg-gray-900 rounded-md px-2 flex flex-row gap-x-1.5 place-items-center"
								>
									<CommandIcon size={16} />
									<span class="font-mono font-bold">K</span>
								</div>
								to open command palette
							</div>
						</button>
					</div>
					<button
						on:click={() => (profilePopup = !profilePopup)}
						class="flex place-items-center justify-center"
						id="avatar-button"
					>
						<Avatar name={$page.data.session.dash_id} />
					</button>
					<Dropdown
						anchor="#avatar-button"
						bind:visible={profilePopup}
						placement="bottom"
						offset={{ x: 0, y: 8 }}
						class="w-fit shadow-2xl"
					>
						<div class="flex flex-col p-3">
							<Text size="xs" color="secondary">
								Dash ID:
								<Text blockquote>
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
								target="_self">Account Settings</a
							>
							<Spacer h={5} />
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
	{/if}

	<slot />
</body>

<Center>
	<Details label="Diagnostic Information">
		<ul class="mb-10">
			{#each $diagnosticString as diagnostic}
				<li class="list-none">
					<Text type="small">{@html diagnostic}</Text>
				</li>
			{/each}
		</ul>
	</Details>
</Center>

<style>
	:root, *, body {
		font-family: "Orange Sans", "Geist", "Circular Std", "Inter", sans-serif;
	}
	.headerparent:first-child {
		opacity: 0.9;
		backdrop-filter: blur(10px);
	}
</style>
