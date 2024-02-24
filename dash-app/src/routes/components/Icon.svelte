<script lang="ts">
    export var dark: string;
    export var light: string;
    export var alt: string = "";
    export var cssClass: string | null | undefined = "";
    export var width: string | null | undefined = "";
    export var height: string | null | undefined = "";
</script>

<img
    class="hidden dark:block {cssClass ?? ""}"
    src={dark}
    alt={alt}
    height="{width ?? ""}"
    width="{height ?? ""}"
/>
<img
    class="dark:hidden {cssClass ?? ""}"
    src={light}
    alt={alt}
    height="{width ?? ""}"
    width="{height ?? ""}"
/>