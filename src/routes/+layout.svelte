<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import "../app.css";
    /** @type {import('./$types').PageData} */
    export let data: App.Locals;
    import Toast from '$lib/Toast.svelte';
    import { toast } from '$lib/notify';

    if(data.authExpired){
        toast("Your Session has Expired. Please Log-In Again.", "error", 3000);
    }
</script>
<div class="h-screen bg-slate-200">
    <Navbar user={data.user}/>
    <div class="max-w-7xl mx-auto h-screen py-14 px-10">
        <slot />
    </div>
    <Toast/>
</div>