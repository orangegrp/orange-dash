<script lang="ts">
	const style =
		"background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 2em;";

	import icon from "$lib/images/orange-logo-w-icon-large.svg";
	import { curTile } from "$lib/store";
	import { onMount } from "svelte";

	import Home from "./components/home.svelte";
	import Global from "./components/global.svelte";
	import Guild from "./components/guild.svelte";

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

<div class="flex justify-center mt-10">
	{#if showWarning}
		<div class="alert variant-filled-warning">
			<!-- Icon -->
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

			<!-- Message -->
			<div class="alert-message">
				<h3 class="h4 k-sans">
					Could not find the API key in local storage!
				</h3>
				<p>
					Please login to the dash at
					<a href="/" class="underline">this</a> page.
				</p>
			</div>
		</div>
	{/if}
</div>

<div class="flex justify-center mt-10">
	{#if api_key && $curTile === 0}
		<Home/>
	{/if}
	{#if api_key && $curTile === 1}
		<Global/>
	{/if}
	{#if api_key && $curTile === 2}
		<Guild/>
	{/if}
</div>