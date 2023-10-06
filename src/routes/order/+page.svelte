<script lang="ts">
	import Breadcrumbs from "$lib/Breadcrumbs.svelte";
    import type { Record } from "pocketbase";
    export let data;
    let products: Record[],
        pinned: Record[];
    console.log(data);
    $: if(data){
        products = data.products.items.filter(i => !i.pinned);
        pinned = data.products.items.filter(i => i.pinned);
    };
</script>

<Breadcrumbs
	path={[
		{ text: 'Home', path: '/' },
		{ text: 'Order' },
	]}
/>

<div class="flex content-between flex-nowrap">
	<h1 class="text-3xl font-bold text-slate-700">
        Order a service
	</h1>
</div>
 {#if pinned.length}
<div class="flex flex-col">
    <h2 class="text-xl font-bold text-slate-600 mt-4 flex flex-row items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pinned-filled rotate-45" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" stroke-width="0" fill="currentColor"></path>
         </svg>
        Pinned
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
        {#each Array(3) as n,col}
        <div class="flex flex-col gap-2 h-fit">
            {#each pinned as pin, i}
                {#if i % 3 == col}
                    <a href="/order/{pin.slugReference}" class="bg-slate-300 hover:bg-slate-300/75 rounded w-full h-full p-4 relative">
                        <h2 class="text-lg font-bold text-slate-600">{pin.name}</h2>
                        <p class="text-slate-500">{pin.description}</p>
                        <div class="flex items-center justify-between mt-4">
                            <p class="text-slate-600">Starting @ 0.75/GB</p>
                        </div>
                    </a>
                {/if}
            {/each}
        </div>
        {/each}
    </div>
</div>
{/if}

<div class="flex flex-col mt-4">
    <h2 class="text-xl font-bold text-slate-600 mt-4 flex flex-row items-center gap-2">
        All Services
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
        {#each Array(3) as n,col}
        <div class="flex flex-col gap-2 h-fit">
            {#each products as product, i}
                {#if i % 3 == col}
                    <a href="/order/{product.slugReference}" class="bg-slate-300 hover:bg-slate-300/75 rounded w-full h-full p-4 relative">
                        <h2 class="text-lg font-bold text-slate-600">{product.name}</h2>
                        <p class="text-slate-500">{product.description}</p>
                        <div class="flex items-center justify-between mt-4">
                            <p class="text-slate-600">Starting @ 0.75/GB</p>
                        </div>
                    </a>
                {/if}
            {/each}
        </div>
        {/each}
    </div>
</div>