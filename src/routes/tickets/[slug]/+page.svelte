<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import { shootImageModal } from '$lib/modal';
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	let FormatTextArea: any;
	/** @type {import('./$types').PageData} */
	export let data: any;
	console.log(data);
	const files = data.ticket.attachments.map((i: string) => `${PUBLIC_POCKETBASE_URL}${data.ticket.collectionId}/${data.ticket.id}/${i}?token=${data.token}`);
	onMount(async () => {
		FormatTextArea = (await import('$lib/FormatTextArea.svelte')).default;
	});
	var editor: Editor;

</script>

<Breadcrumbs
	path={[
		{ text: 'Home', path: '/' },
		{ text: 'Tickets', path: '/tickets' },
		{ text: data.ticket.id }
	]}
/>

<h1 class="text-3xl font-bold text-slate-700">Viewing Ticket</h1>

<div class="w-full rounded mt-4">
	<p class="text-slate-600 text-sm">Subject</p>
	<p class="text-slate-600 font-bold mb-2">{data.ticket.subject}</p>
	<p class="mb-1 text-slate-600 text-sm">Details</p>
	{#if FormatTextArea}
		<svelte:component
			this={FormatTextArea}
			editable={false}
			bind:editor
			text={data.ticket.text}
			charLimit={4000}
		/>
	{/if}
	{#if files.length}
	<div class="border border-slate-400/40 mt-2 rounded gap-2 text-slate-600 p-2 flex flex-row flex-wrap">
		{#each files as file, i}
			<button type="button" on:click={() => {
				shootImageModal(data.ticket.attachments[i], file);
			}} class="group grid place-items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="absolute text-white z-10 hidden group-hover:block" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M16 4l4 0l0 4"></path>
					<path d="M14 10l6 -6"></path>
					<path d="M8 20l-4 0l0 -4"></path>
					<path d="M4 20l6 -6"></path>
					<path d="M16 20l4 0l0 -4"></path>
					<path d="M14 14l6 6"></path>
					<path d="M8 4l-4 0l0 4"></path>
					<path d="M4 4l6 6"></path>
				 </svg>
				<img src={file} alt="Attachment" width="64" height="64" class="aspect-square overflow-hidden rounded group-hover:brightness-[0.25] group-hover:bg-black/75">
			</button>
		{/each}
	</div>
	{/if}
	<div class="border border-slate-400/40 mt-2 rounded grid grid-cols-4 gap-2 text-slate-600 p-2">
		<div class="flex flex-col flex-nowrap gap-1">
			<p class="text-sm">Category</p>
			<p class="font-bold">{data.ticket.expand.category.name}</p>
		</div>
		<div class="flex flex-col flex-nowrap gap-1">
			<p class="text-sm">Priority</p>
			<p class="font-bold">{data.ticket.expand.priority.name}</p>
		</div>
		<div class="flex flex-col flex-nowrap gap-1">
			<p class="text-sm">Status</p>
			<p>
				{#if data.ticket.status == 0}
					<span
						class="px-2 py-1 rounded bg-gray-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Draft</span
					>
				{:else if data.ticket.status == 1}
					<span
						class="px-2 py-1 rounded bg-green-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Open</span
					>
				{:else if data.ticket.status == 2}
					<span
						class="px-2 py-1 rounded bg-yellow-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Awaiting Client Response</span
					>
				{:else if data.ticket.status == 3}
					<span
						class="px-2 py-1 rounded bg-orange-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Awaiting Staff Response</span
					>
				{:else if data.ticket.status == 4}
					<span
						class="px-2 py-1 rounded bg-red-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Closed</span
					>
				{:else}
					<span
						class="px-2 py-1 rounded bg-violet-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
						>Closed by Staff</span
					>
				{/if}
			</p>
		</div>
		<div class="flex flex-col flex-nowrap gap-1">
			<p class="text-sm">Date Opened</p>
			<div class="flex flex-col gap-0 font-bold">
        <p class="leading-5">{new Date(data.ticket.created).toDateString()}, {new Date(data.ticket.created).toLocaleTimeString()}</p>
      </div>
		</div>
	</div>
</div>
