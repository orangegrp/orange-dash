<script lang="ts">
    export let header = false;

    export let onclick = (e: Event) => {};
    export let ondblclick = (e: Event) => {};
    export let onmouseenter = (e: Event) => {};
    export let onmouseleave = (e: Event) => {};
</script>

<tr
    on:click={onclick}
    on:dblclick={ondblclick}
    on:mouseenter={onmouseenter}
    on:mouseleave={onmouseleave}
    class={header
        ? "flex place-items-center border border-gray-100 dark:border-gray-900 py-2 rounded-md px-2 dark:bg-gray-950 bg-gray-50"
        : "flex place-items-center px-2 py-2 border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all"}
>
    <slot />
</tr>