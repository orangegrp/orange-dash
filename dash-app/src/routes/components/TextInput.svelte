<script lang="ts">
    import { onMount } from "svelte";
    import type { HTMLInputTypeAttribute } from "svelte/elements";

    let classes: string = "";
    export { classes as class };
    export let type: HTMLInputTypeAttribute = "text";
    export let id: string = null;
    export let name: string = null;
    export let maxlength: number = null;
    export let autocapitalize: string = null;
    export let autocorrect: string = null;
    export let spellcheck: boolean = null;
    export let inputmode:
        | "email"
        | "search"
        | "tel"
        | "text"
        | "url"
        | "none"
        | "numeric"
        | "decimal" = null;
    export let autocomplete: string = null;
    export let placeholder: string = null;
    export let value: any = null;

    let inputElement: HTMLInputElement;

    onMount(() => {
        inputElement.addEventListener("input", () => {
            value = inputElement.value;
        });
    });
</script>

<input
    class="text-gray-900 dark:text-gray-100 border dark:border-gray-900 rounded-lg {classes}"
    {type}
    {id}
    {name}
    {maxlength}
    {autocapitalize}
    {autocorrect}
    {spellcheck}
    {inputmode}
    {placeholder}
    {autocomplete}
    {value}
    bind:this={inputElement}
/>

<style>
    input {
        background-color: transparent;
        padding: 10px;
        height: 36px;
        outline: none;
    }
    input:focus {
        border: solid 1px #aaaaaa;
        box-shadow: 0px 0px 0px 3px #aaaaaa44;
    }
</style>
