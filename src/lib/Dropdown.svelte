<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let text: string = 'Dropdown';
	export let xFromLeft: boolean = true;
	export let topBorder: boolean = false;
	export let urls: Array<{text: string, url?: string, emphasis?: "default" | "success" | "danger" | "warning", click?: () => void, divider?: boolean, form?: {method: "GET" | "POST" | "PUT" | "DELETE", action: string, enhance?: (result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>) => void}}> = [];
	export let displayAsMore: boolean = false;
	let dropdownEl: HTMLElement;
	let dropdown: HTMLElement;
	onMount(() => {
		dropdownEl.addEventListener("focusin", () => {
            dropdown.setAttribute("aria-hidden", "false");
        });
        dropdownEl.addEventListener("focusout", handleFocusOut);
        [...dropdown.children].forEach((child: Element) => {
            (child as HTMLElement)?.addEventListener("focusout", handleFocusOut);
        });

        function handleFocusOut(event: FocusEvent): void{
            const relatedTarget = event.relatedTarget
            if(dropdown.contains(relatedTarget as Element)) return;
            dropdown.setAttribute("aria-hidden", "true");
        }
	});
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<p
	bind:this={dropdownEl}
	class="hover:text-slate-800 {displayAsMore ? "text-slate-500" : "text-slate-600"} focus:text-slate-800 cursor-pointer flex flex-row flex-nowrap items-center gap-1 peer"
	tabindex="0"
>
	{#if displayAsMore}
	<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
		<path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
		<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
		<path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
	 </svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-3 h-3 mt-0.5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
		{text}
	{/if}
</p>
<div
	bind:this={dropdown}
	class="absolute border border-slate-400/40 py-1 bg-slate-200 z-50 {topBorder ? "rounded" : "border-t-0 rounded-b"} {xFromLeft ? "left-0" : "right-0"} w-fit -top-[100000px] focus-visible:top-10 focus:top-10 focus-within:top-10 peer-focus-visible:top-10 peer-focus:top-10 peer-focus-within:top-10"
    aria-hidden="true"
>
	<ul class="leading-loose rotate-0">
		{#each urls as link}
		<li class="hover:bg-slate-300/50 {(link.emphasis == "default" || !link.emphasis) ? "text-slate-600 hover:text-slate-800" : link.emphasis == "danger" ? "text-red-600 hover:text-red-700" : link.emphasis == "success" ? "text-green-600 hover:text-green-700" : "text-yellow-600 hover:text-yellow-700"}">
			{#if link.click}
			<button type="button" on:click={link.click} class="w-40 block px-2 text-left">
				{link.text}
			</button>
			{:else if link.form}
			<form action={link.form?.action} method={link.form.method} use:enhance={({}) => {
				return async ({ result }) => {
					link.form?.enhance?.(result);
				};
			}}>
				<button type="submit" class="w-40 block px-2 text-left">
					{link.text}
				</button>
			</form>
			{:else if link.divider}
				<hr class="border-t border-slate-400/40 mx-2 my-1">
			{:else}
			<a href={link.url} class="w-40 block px-2">
				{link.text}
			</a>
			{/if}
		  </li>
		{/each}
		<slot />	
	</ul>
</div>
