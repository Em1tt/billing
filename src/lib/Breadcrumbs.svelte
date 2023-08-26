<script lang="ts">
    export let path: Array<{text: string, path?: string}>;
</script>

<div class="flex flex-row items-center gap-1 mt-8 mb-6">
    {#each path as p, i}
        {#if p.path}
        <a class="flex flex-row flex-nowrap items-center text-slate-400 hover:text-slate-600 gap-1" href={p.path}>
            <p>{p.text}</p>
            {#if path[i] != path[path.length-1]}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg> 
            {/if}
        </a>
        {:else}
        <p class="flex flex-row flex-nowrap items-center text-slate-500 cursor-default gap-1">
            <span>{p.text}</span>
            {#if path[i] != path[path.length-1]}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg> 
            {/if}
        </p>
        {/if}         
    {/each}
</div>