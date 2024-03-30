<script lang="ts">
    export let header = false;
    export let headerPos: "left" | "right" | "center" = "center";
    let classes = "";
    let styles = "";
    let itemId = "";
    export { itemId as id };
    export { classes as class };
    export { styles as style };

    export let onclick = (e: Event) => {};
    export let ondblclick = (e: Event) => {};
    export let onmouseenter = (e: Event) => {};
    export let onmouseleave = (e: Event) => {};

    let hover = false;
</script>

{#if header}
    <th
        id={itemId}
        class="flex-1 text-{headerPos} w-full px-1 border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all"
        on:click={onclick}
        on:dblclick={ondblclick}
        on:mouseenter={onmouseenter}
        on:mouseleave={onmouseleave}
    >
        <span
            class="flex-1 w-full {classes}  text-gray-600 dark:text-gray-600 font-normal {header
                ? 'text-xs uppercase'
                : 'font-light'}"
        >
            <slot />
        </span>
    </th>
{:else}
    <td
        id={itemId}
        style="word-wrap: break-word !important; {styles}"
        class="flex-1 w-full px-2 border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all"
        on:click={onclick}
        on:dblclick={ondblclick}
        on:mouseenter={(e) => {
            hover = true;
            onmouseenter(e);
        }}
        on:mouseleave={(e) => {
            hover = false;
            onmouseleave(e);
        }}
    >
        <span
            style="word-wrap: break-word !important;"
            class="flex-1 w-full {classes} text-gray-600 dark:text-gray-600 font-normal {header
                ? 'text-xs uppercase'
                : 'font-light'}"
        >
            <slot />
            {#if hover}
                <slot name="hover" />
            {/if}
        </span>
    </td>
{/if}
