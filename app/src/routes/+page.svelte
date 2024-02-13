<script lang="ts">
	import icon from "$lib/images/orange-logo-w-icon-large.svg";
	import type { ModalSettings } from "@skeletonlabs/skeleton";

	import { getModalStore } from "@skeletonlabs/skeleton";
	export const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: "prompt",
		title: "Access the dash",
		body: "Please enter the API key in order to access the dash. The API key will be saved in local storage and will be used to make API requests.",
		value: "",
		buttonTextSubmit: "Continue",
		valueAttr: { type: "password", required: true },
		response: (r: string) => {
			if (r) {
				localStorage.setItem("orange-dash-api-key", r);
				window.location.href = "/app";
			}
		},
	};

	function checkKey() {
		if (!localStorage.getItem("orange-dash-api-key")) {
			modalStore.trigger(modal);
		} else {
			window.location.href = "/app";
		}
	}
</script>

<head>
	<title> orange Dash </title>
</head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<img src={icon} class="h-32" alt="icon" />
		<div class="flex justify-center space-x-2">
			<button class="btn variant-filled" on:click={() => checkKey()}>
				Access the dash
			</button>
		</div>
	</div>
</div>
