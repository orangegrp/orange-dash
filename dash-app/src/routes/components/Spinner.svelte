<script lang="ts">
    import { mode } from "mode-watcher";
    export let size: "large" | "normal" = "normal";
    export let animate: boolean = true;
    let classes: string = "";
    export { classes as class };
</script>

<div
    class="darwin-spinner {size === 'large' ? 'darwin-spinner-large' : ''} {$mode === 'light'
        ? 'gray'
        : 'white'} {animate ? 'animating' : ''} {classes}"
>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
    <div class="darwin-spinner-blade"></div>
</div>

<style>
    .darwin-spinner {
        position: relative;
        width: 20px;
        height: 20px;
    }
    .darwin-spinner .darwin-spinner-blade {
        position: absolute;
        top: 6.5px;
        left: 8.5px;
        width: 2px;
        height: 6px;
        background-color: #8e8e93;
        border-radius: 1.25px;
        animation: darwin-spinnerBlade 1s linear infinite;
        will-change: opacity;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(1) {
        transform: rotate(45deg) translateY(-6.5px);
        animation-delay: -1.625s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(2) {
        transform: rotate(90deg) translateY(-6.5px);
        animation-delay: -1.5s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(3) {
        transform: rotate(135deg) translateY(-6.5px);
        animation-delay: -1.375s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(4) {
        transform: rotate(180deg) translateY(-6.5px);
        animation-delay: -1.25s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(5) {
        transform: rotate(225deg) translateY(-6.5px);
        animation-delay: -1.125s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(6) {
        transform: rotate(270deg) translateY(-6.5px);
        animation-delay: -1s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(7) {
        transform: rotate(315deg) translateY(-6.5px);
        animation-delay: -0.875s;
    }
    .darwin-spinner .darwin-spinner-blade:nth-child(8) {
        transform: rotate(360deg) translateY(-6.5px);
        animation-delay: -0.75s;
    }
    .darwin-spinner.darwin-spinner-large {
        width: 35px;
        height: 35px;
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade {
        top: 11.5px;
        left: 15px;
        width: 5px;
        height: 12px;
        border-radius: 2.5px;
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(1) {
        transform: rotate(45deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(2) {
        transform: rotate(90deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(3) {
        transform: rotate(135deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(4) {
        transform: rotate(180deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(5) {
        transform: rotate(225deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(6) {
        transform: rotate(270deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(7) {
        transform: rotate(315deg) translateY(-11.5px);
    }
    .darwin-spinner.darwin-spinner-large .darwin-spinner-blade:nth-child(8) {
        transform: rotate(360deg) translateY(-11.5px);
    }

    @keyframes darwin-spinnerBlade {
        0% {
            opacity: 0.85;
        }
        50% {
            opacity: 0.25;
        }
        100% {
            opacity: 0.25;
        }
    }
</style>
