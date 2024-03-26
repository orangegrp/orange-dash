<script lang="ts">
    import { onMount } from "svelte";

    let iframe: HTMLIFrameElement;
    export let src = "";
    export let title = "IFRAME";
    export let rewriteproxy = "";
    let classes = "";
    export { classes as class };

    export let state: "loading" | "loaded" | "error" = "loading";

    onMount(() => {
        //let script  = "const open = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function (method, url, ...rest) { url = \"/notbot-proxy\" + url; return open.call(this, method, url, ...rest); };";
        //(iframe.contentWindow as any).eval(script);

        /*
        const open = (iframe.contentWindow as any).XMLHttpRequest.prototype
            .open;
        (iframe.contentWindow as any).XMLHttpRequest.prototype.open = function (
            method,
            url,
            ...rest
        ) {
            url = "/notbot-proxy" + url;
            return open.call(this, method, url, ...rest);
        };

        const fetch = iframe.contentWindow.fetch;
        iframe.contentWindow.fetch = function (url, options) {
            url = "/notbot-proxy" + url;
            return fetch.call(this, url, options);
        };

        const srcSetter = (iframe.contentWindow as any).HTMLScriptElement.prototype.srcSetter;
        (iframe.contentWindow as any).HTMLScriptElement.prototype.srcSetter = function (
            url,
        ) {
            url = "/notbot-proxy" + url;
            return srcSetter.call(this, url);
        };
        */
    });
</script>

<div>
    <iframe on:load={async () => {
        fetch("/notbot-proxy").then(r => r.status === 200 ? state = "loaded" : state = "error");
    }} class={classes} {title} bind:this={iframe} {src}></iframe>
</div>
