<script lang="ts">
    export let header = false;
    let classes = "";
    export { classes as class };

    export let onclick = (e: Event) => {};
    export let ondblclick = (e: Event) => {};
    export let onmouseenter = (e: Event) => {};
    export let onmouseleave = (e: Event) => {};

    let hover = false;
</script>

<tr
    on:click={onclick}
    on:dblclick={ondblclick}
    on:mouseenter={(e) => { hover = true; onmouseenter(e); } }
    on:mouseleave={(e) => { hover = false; onmouseleave(e); } }
    class={header
        ? classes + " w-full flex flex-grow place-items-center border border-gray-100 dark:border-gray-900 py-2 rounded-md px-2 dark:bg-gray-950 bg-gray-50 " + classes
        : classes + " w-full flex flex-grow place-items-center px-2 py-2 border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all " + classes}
>
    <slot/>

    {#if hover}
        <slot name="hover" />
    {/if}
</tr>