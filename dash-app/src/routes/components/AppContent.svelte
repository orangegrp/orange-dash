<script lang="ts">
   let classes: string = "";
   export { classes as class };
</script>

<main
    class="dark:bg-black min-w-fit min-h-fit overflow-auto h-auto border-y dark:border-y-gray-900 border-y-gray-100 {classes}"
>
    <div class="flex flex-col md:flex-row gap-x-8 gap-y-4 mb-[30vh]">
        <slot name="navigation" />
        <slot name="content" />
    </div>

</main>