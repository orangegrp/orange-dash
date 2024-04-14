<script lang="ts">
    import {
        EmbedVisualizer,
        parseContent,
        parseTitle,
    } from "embed-visualizer";
    import "embed-visualizer/dist/index.css";

    export let embedObject: any = undefined;
</script>

<react:EmbedVisualizer embed={embedObject}></react:EmbedVisualizer>
