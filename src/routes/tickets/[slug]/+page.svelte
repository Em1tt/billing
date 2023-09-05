<script>
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);
    import TipTap from '$lib/TipTap.svelte';
    import Select from '$lib/Select.svelte';
  </script>

<Breadcrumbs path={[{text: "Home", path: "/"}, {text: "Tickets", path: "/tickets"}, {text: data.slug}]} />

<h1 class="text-3xl font-bold text-slate-700">Create a ticket</h1>

<fieldset class="relative mt-3 flex items-center gap-2 w-80">
  
  <Select defaultText="Ticket Category"/>
</fieldset>
<p>Hello</p>