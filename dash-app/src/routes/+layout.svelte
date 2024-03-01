<script lang="ts">
	import "geist-ui-svelte/styles/geist-ui-svelte.css";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import { page } from '$app/stores';

	import { Header, LightSwitch, Details, Center, Text, Note } from "geist-ui-svelte";
	import Icon from "./components/Icon.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

	let diagnosticString = writable<string[]>([]);

	onMount(async () => {
		const diagnosticData = await (await fetch("/api/diagnostics")).json();
		
		const newDiagnostics = [
			`Request ID: &nbsp; <code>${diagnosticData.requestId}</code>`,
			`Your IP Address: &nbsp; <code>${diagnosticData.clientIp}</code>`,
			`Platform: &nbsp; <code>${diagnosticData.clientPlatform}</code>`,
			`User Agent: &nbsp; <code>${diagnosticData.clientUa}</code>`
		];

		diagnosticString.set([...$diagnosticString, ...newDiagnostics]);
	});
</script>

<ModeWatcher defaultMode="dark" />

<Header noBorder={$page.url.pathname.startsWith("/app") ? true : false}>
	<div
		class="flex place-items-center justify-between w-full p-2 px-8"
	>
		<div class="flex flex-row gap-x-3 select-none">
			<Icon
				dark="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-w-icon.svg"
				light="https://raw.githubusercontent.com/orangegrp/orange-website/main/orange/src/lib/images/orange-logo-b-icon.svg"
				width="48"
				height="48"
				alt="Logo"
			/>
			<strong>Dash</strong>
		</div>

		<LightSwitch />
	</div>
</Header>

<body class="dark:bg-black bg-gray-50 mb-4">
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
		font-family: "Inter";
		/* font-family: "circular std"; */
	}
</style>