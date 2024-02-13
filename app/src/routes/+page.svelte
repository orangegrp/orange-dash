<script lang="ts">
	import icon from "$lib/images/orange-logo-w-icon-large.svg";
    import type { ModalSettings } from "@skeletonlabs/skeleton";

	import { getModalStore } from "@skeletonlabs/skeleton";
	export const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: "prompt",
		// Data
		title: "Access the dash",
		body: "Enter the API key to connect to the dash. The key will be stored in your browser's local storage and you will be redirected to the app page when you login.",
		// Populates the input value and attributes
		value: "",
		buttonTextSubmit: "Login",
		valueAttr: { type: "password", required: true },
		// Returns the updated response value
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
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img src={icon} class="h-32" />
		</figure>
		<!-- / -->
		<div class="flex justify-center space-x-2">
			<button
				class="btn variant-filled"
				on:click={() => checkKey()}
			>
				Access the dash
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
