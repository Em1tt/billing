<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string = 'Dropdown';
	export let offsetX: number = 2;
	export let offsetY: number = 10;
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
            console.log(relatedTarget instanceof Element);
            if(dropdown.contains(relatedTarget as Element)) return;
            dropdown.setAttribute("aria-hidden", "true");
        }
	});
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<p
	bind:this={dropdownEl}
	class="hover:text-slate-800 focus:text-slate-800 cursor-pointer flex flex-row flex-nowrap items-center gap-1 peer"
	tabindex="0"
>
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
</p>
<div
	bind:this={dropdown}
	class="absolute border border-slate-400/20 py-1  border-t-0 -left-{offsetX} w-fit -top-[2000px] focus-visible:top-10 focus:top-10 focus-within:top-10 peer-focus-visible:top-10 peer-focus:top-10 peer-focus-within:top-10 rounded-b"
    aria-hidden="true"
>
	<slot />
</div>
