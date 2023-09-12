<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import "../app.css";
    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);
</script>
<div class="h-screen bg-slate-200">
    <Navbar/>
    <div class="max-w-7xl mx-auto h-screen py-14 px-10">
        <slot />
    </div>
</div>