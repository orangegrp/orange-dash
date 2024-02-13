<script lang="ts">
	const style =
		"background-color: red; color: white; font-style: monospace; border: 1px solid white; font-size: 2em;";

	import Home from "./views/home.svelte";
	import Settings from "./views/settings.svelte";
	import Modules from "./views/modules.svelte";
	
	import { appRailRoot } from "$lib/store";
	import { onMount } from "svelte";

	var api_key: string | null = "";
	var showWarning = false;

	onMount(() => {
		api_key = localStorage.getItem("orange-dash-api-key");

		console.log(`%cWARNING! DO NOT SHARE THIS TOKEN!`, style);
		console.log("Loaded api key from storage: ", api_key);
		console.log(`%cWARNING! DO NOT SHARE THIS TOKEN!`, style);
		showWarning = !api_key;
	});
</script>

<head>
	<title> Dash </title>
</head>

{#if showWarning}
<div class="flex justify-center">
	<div class="alert variant-filled-warning">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="w-8 h-8"
		>
			<path
				fill-rule="evenodd"
				d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
				clip-rule="evenodd"
			/>
		</svg>

		<div class="alert-message">
			<h3 class="h4 k-sans">
				No API key found. You are not logged in to the Dash.
			</h3>
			<p>
				Please login to the Dash at
				<a href="/" class="underline">this</a> page.
			</p>
			<p class="text-xs">
				You will need to enter an API key provided by an orange Bot administrator. Please ask Topias or Alexei for assistance.
			</p>
		</div>
	</div>
</div>
{/if}

{#if api_key && $appRailRoot === 2}
	<Modules />
{:else}
	<div class="flex justify-center">
		{#if api_key && $appRailRoot === 0}
			<Home />
		{/if}
		{#if api_key && $appRailRoot === 1}
			<Settings />
		{/if}
	</div>
{/if}