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
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<img
					src="favicon.png"
					class="h-8 mr-2"
					alt="orange Dash Logo"
				/>
				<span class="k-bold text-xl">orange Dash</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://orange.order332.com"
					target="_blank"
					rel="noreferrer"
				>
					Project
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://order332.com"
					target="_blank"
					rel="noreferrer"
				>
					332
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
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
