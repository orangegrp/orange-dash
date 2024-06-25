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
		BreadCrumbs,
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
			},
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
			},
		},
		{
			title: "Danger Zone",
			subTitle:
				"Lock your account in case it gets compromised or delete it if you no longer want to use it again",
			onRun: ({ action, storeProps, storeMethods }) => {
				window.location.href = "/app/account/danger-zone";
			},
		},
		{
			title: "StudyBot™",
			subTitle: "Access the StudyBot™ applet.",
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
	<div
		class="flex flex-col gap-y-1 w-full bg-orange-700 min-h-8 animate-pulse"
	>
		<div class="flex flex-row gap-x-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
				/>
			</svg>

			<span class="font-black text-white text-xl"
				>DEMO INSTANCE / DEMO-ESTEMINEN / INSTANCIA DE DEMOSTRACIÓN /
				INSTANCE DE DÉMO / DEMO INSTANCIJA / ДЕМО ЭКЗЕМПЛЯР / 演示实例 /
				مثيل تجريبي
			</span>
		</div>
		<span class="font-black text-white text-xs"
			>This web application is for testing purposes only. Any account and
			its settings you set will not be kept. / Tämä verkkosovellus on
			tarkoitettu vain testaustarkoituksiin. Mitään määrittämiäsi tilejä
			ja sen asetuksia ei säilytetä. / Cette application Web est
			uniquement destinée à des fins de test. Tout compte et ses
			paramètres que vous définissez ne seront pas conservés. / Esta
			aplicación web es sólo para fines de prueba. Ninguna cuenta y su
			configuración que establezca no se conservarán. / Ši žiniatinklio
			programa skirta tik testavimo tikslams. Jokia paskyra ir jos
			nustatymai nebus išsaugoti. / Это веб-приложение предназначено
			только для тестирования. Любая учетная запись и ее настройки,
			которые вы установили, не будут сохранены. / 此 Web
			应用程序仅用于测试目的。您设置的任何帐户及其设置均不会被保留。/
			تطبيق الويب هذا مخصص لأغراض الاختبار فقط. لن يتم الاحتفاظ بأي حساب
			وإعداداته التي قمت بتعيينها.</span
		>
	</div>
	{#if !$page.url.pathname.startsWith("/applets")}
		<div
			class={$page.url.pathname.startsWith("/app") ? "" : "headerparent"}
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
					class="flex place-items-center justify-between w-full py-1 px-4 md:py-2 {$page.url.pathname.startsWith(
						'/app/account',
					) || $page.url.pathname.startsWith('/login')
						? ''
						: 'lg:py-0'} sm:px-8"
				>
					<div
						class="flex flex-row gap-x-3 select-none items-center justify-between"
					>
						<Icon
							dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
							light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
							width="48"
							height="48"
							alt="Logo"
						/>
						<span class="ml-[-2.5px] inline font-extrabold">
							orange
							<span
								class="ml-[-2.5px] mr-1"
								style="color:#ff6723;"
							>
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
										<span class="font-mono font-bold"
											>K</span
										>
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
									class="ml-[-2px] text-sm text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
				hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex flex-row gap-x-4 justify-between items-center"
									href="/app"
									target="_self"
									>Dashboard
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
										/>
									</svg>
								</a>
								<Spacer h={5} />
								<a
									class="ml-[-2px] text-sm text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
						hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex flex-row gap-x-4 justify-between items-center"
									href="/app/account"
									target="_self"
									>Account Settings
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								</a>
								<Spacer h={5} />
								<button
									class="ml-[-2px] text-sm text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
					hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex flex-row gap-x-6 justify-between items-center"
									on:click={() => {
										paletteMethods.openPalette();
										profilePopup = false;
									}}
									>Command Palette
									<div
										class="border border-gray-900 rounded-md px-2 py-0.5 flex flex-row gap-x-1.5 place-items-center"
									>
										<CommandIcon size={12} />
										<span
											class="font-mono text-xs font-bold"
											>K</span
										>
									</div>
								</button>
								<Spacer h={10} />
								<Divider />
								<Spacer h={8} />
								<a
									class="ml-[-2px] text-sm text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
					hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex flex-row gap-x-4 justify-between items-center"
									href="https://orange.order332.com"
									target="_blank"
									>orange🟠 Website
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
										/>
									</svg>
								</a>
								<Spacer h={5} />
								<button
									class="ml-[-2px] text-sm text-left rounded-md pl-2 p-1 text-gray-500 hover:text-gray-999
						hover:dark:text-gray-0 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex flex-row gap-x-6 justify-between items-center"
									on:click={() => {
										showLogoutConfirmation = true;
										profilePopup = false;
									}}
									>Log Out
								</button>
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
	:root,
	*,
	body {
		font-family: "Orange Sans", "Geist", "Circular Std", "Inter", sans-serif;
	}
	.headerparent:first-child {
		opacity: 0.9;
		backdrop-filter: blur(10px);
	}
</style>
