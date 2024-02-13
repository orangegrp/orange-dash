<script lang="ts">
	import "../app.postcss";
	import "../app.css";
	import { AppShell, AppBar, Modal, Toast } from "@skeletonlabs/skeleton";

	// Highlight JS
	import hljs from "highlight.js/lib/core";
	import "highlight.js/styles/github-dark.css";
	import { storeHighlightJs } from "@skeletonlabs/skeleton";
	import xml from "highlight.js/lib/languages/xml"; // for HTML
	import css from "highlight.js/lib/languages/css";
	import javascript from "highlight.js/lib/languages/javascript";
	import typescript from "highlight.js/lib/languages/typescript";

	hljs.registerLanguage("xml", xml); // for HTML
	hljs.registerLanguage("css", css);
	hljs.registerLanguage("javascript", javascript);
	hljs.registerLanguage("typescript", typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import {
		computePosition,
		autoUpdate,
		flip,
		shift,
		offset,
		arrow,
	} from "@floating-ui/dom";
	import { storePopup } from "@skeletonlabs/skeleton";
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores } from "@skeletonlabs/skeleton";

	initializeStores();
</script>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class=" shadow-2xl">
			<svelte:fragment slot="lead">
				<img
				src="favicon.png"
				class="h-8 mr-2 select-none"
				alt="orange Dash Logo"	
				/>
				<span class="k-bold text-xl select-none">orange Dash</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface shadow-lg hover:scale-125"
					href="https://orange.order332.com"
					target="_blank"
					rel="noreferrer"
				>
					Project
				</a>
				<a
					class="btn btn-sm variant-ghost-surface shadow-lg hover:scale-125"
					href="https://order332.com"
					target="_blank"
					rel="noreferrer"
				>
					332
				</a>
				<a
					class="btn btn-sm variant-ghost-surface shadow-lg hover:scale-125"
					href="https://github.com/orangegrp"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>