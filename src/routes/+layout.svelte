<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import "../app.css";
    import { pb } from "$lib/pocketbase";
    /** @type {import('./$types').PageData} */
    export let data;
    if(!data.isValid || !pb.authStore.isValid){
        pb.authStore.clear();
    }
</script>
<div class="h-screen bg-slate-200">
    <Navbar/>
    <div class="max-w-7xl mx-auto h-screen py-14 px-10">
        <slot />
    </div>
</div>