<script lang="ts">
    export let header = false;

    export let onclick = (e: Event) => {};
    export let ondblclick = (e: Event) => {};
    export let onmouseenter = (e: Event) => {};
    export let onmouseleave = (e: Event) => {};
</script>

{#if header}
    <th
        class="w-full px-2 border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all"
        on:click={onclick}
        on:dblclick={ondblclick}
        on:mouseenter={onmouseenter}
        on:mouseleave={onmouseleave}
    >
        <span
            class="w-full text-gray-600 dark:text-gray-600 font-light {header
                ? 'text-xs uppercase'
                : ''}"
        >
            <slot />
        </span>
    </th>
{:else}
    <td
        class="w-full px-2 border-gray-100 dark:border-gray-900 hover:bg-gray-50 hover:dark:bg-gray-950 transition-all"
        on:click={onclick}
        on:dblclick={ondblclick}
        on:mouseenter={onmouseenter}
        on:mouseleave={onmouseleave}
    >
        <span
            class="w-full text-gray-600 dark:text-gray-600 font-light {header
                ? 'text-xs'
                : ''}"
        >
            <slot />
        </span>
    </td>
{/if}
