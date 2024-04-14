<script lang="ts">
    export let active: boolean = false;
    let classes: string = "";
    export { classes as class };
    export let btnClicked: (
        e: MouseEvent & {
            currentTarget: EventTarget & HTMLButtonElement;
        },
    ) => void = null;
</script>

<button
    on:click={(e) => { if (btnClicked) btnClicked(e); }}
    class="transition-all rounded-md flex place-items-center text-nowrap whitespace-nowrap bg-transparent {active ? "text-gray-999 bg-gray-200" : "text-gray-600"} hover:text-gray-999 data-[a]:hover:bg-gray-400 enabled:hover:bg-gray-200 data-[a]:hover:dark:bg-gray-900 enabled:hover:dark:bg-gray-900 {active ? "dark:text-gray-0 dark:bg-gray-900" : "dark:text-gray-500"} hover:dark:text-gray-0 px-4 py-2.5 text-sm min-h-[36px] {classes}"
>
    <slot />
</button>

<style>
    :root, *, button {
		font-family: "Geist", "Circular Std", "Inter", sans-serif !important;
	}
</style>