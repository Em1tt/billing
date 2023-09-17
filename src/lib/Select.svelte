<script lang="ts">
	import { onMount } from "svelte";

    let selected: string | null | undefined;
    export let defaultText: string;
    export let options: Array<{value: string, text: string, id: string}>
    export let value: string | null | undefined;
    let select: HTMLElement;
    let open: boolean = false;
    function toggleSelect(){
        open = !open;
    }
    function changeText(event: any){
        selected = ((event.currentTarget as HTMLElement).parentElement)?.getAttribute("data-text");
        value = ((event.currentTarget as HTMLElement).parentElement)?.parentElement?.querySelector("input")?.value;
        toggleSelect();
    }
    onMount(()=>{
        select.addEventListener("focusout", (ev) => {
            if(select.contains(ev.relatedTarget as Node)) return;
            open = false;
        })
    })
</script>

<div bind:this={select} class="flex flex-col flex-nowrap w-full relative">
    <button type="button" on:click={toggleSelect} class="py-2 px-3 relative text-left cursor-pointer bg-transparent w-full h-[42px] border {selected ? "border-slate-400" : "border-slate-400/40"} rounded focus:border-sky-500 outline-none text-slate-400 focus:text-sky-500 peer group">
        <p class="absolute {selected ? "-top-3 left-1" : open ? "-top-3 left-1" : "left-3 top-1.5"} pointer-events-none duration-100 text-slate-400 group-focus-within:text-sky-500 bg-slate-200 rounded px-1">{defaultText}</p>
        <p class="text-slate-600 group-focus-within:text-sky-500">{selected ? selected : ""}</p>
        {#if open}
        <svg class="w-4 h-4 absolute right-2 top-3" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 15.75l7.5-7.5 7.5 7.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        {:else}
        <svg class="w-4 h-4 absolute right-2 top-3" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        {/if}
    </button>
    <ul class="border border-slate-400 z-20 rounded mt-0.5 absolute top-full w-full bg-slate-200 {open ? "block" : "hidden"}">
        {#each options as option}
        <li class="flex flex-row hover:bg-slate-300 duration-100 w-full group cursor-pointer">
            <input type="radio" name="category" class="hidden peer" value={option.value} >
            <label for="config" class="cursor-pointer text-slate-600 group-hover:text-slate-800 w-full" data-text={option.text}>
            <button type="button" on:click={changeText} class="w-full p-2 text-left">{option.text}</button></label>
        </li>
        {/each}
    </ul>
</div>