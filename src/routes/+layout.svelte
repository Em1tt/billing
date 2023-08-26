<script>
    import Navbar from "$lib/Navbar.svelte";
    import "../app.css";
</script>
<div class="h-screen bg-slate-200">
    <Navbar/>
    <div class="max-w-7xl mx-auto h-screen py-14">
        <slot />
    </div>
</div>