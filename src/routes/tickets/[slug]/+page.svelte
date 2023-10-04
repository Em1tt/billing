<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import { shootImageModal } from '$lib/modal';
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import Dropdown from '$lib/Dropdown.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { applyAction, enhance } from '$app/forms';
	let FormatTextArea: any;
	/** @type {import('./$types').PageData} */
	export let data: any;
	
	let messages = data?.messages?.items;
	let text: string;

	$: if(data){
		messages = data?.messages?.items;
	};
	const files = data.ticket.attachments.map((i: string) => `${PUBLIC_POCKETBASE_URL}${data.ticket.collectionId}/${data.ticket.id}/${i}?token=${data.token}`);
	onMount(async () => {
		FormatTextArea = (await import('$lib/FormatTextArea.svelte')).default;
	});
	var editor: Editor;
	var messageEditor: Editor;
</script>

<Breadcrumbs
	path={[
		{ text: 'Home', path: '/' },
		{ text: 'Tickets', path: '/tickets' },
		{ text: data.ticket.id }
	]}
/>

<div class="flex content-between flex-nowrap">
	<h1 class="text-3xl font-bold text-slate-700">
	  Viewing Ticket
	</h1>
	<div class="ml-auto items-center relative flex">
	  <Dropdown displayAsMore={true} topBorder={true} xFromLeft={false} urls={[{text: "Edit Ticket", url: `/tickets/${data.ticket.id}/edit`}, (data.ticket.status != 4 && data.ticket.status != 5) ? {text: "Close ticket", emphasis: "danger", form: {action: "?/close", method: "POST", async enhance() {invalidateAll()}}} : {text: "Open Ticket", emphasis: "success", form: {action: "?/open", method: "POST", async enhance(){invalidateAll()}}}]}/>
	</div>
  </div>

<div class="w-full rounded mt-4">
	<p class="text-slate-600 text-sm">Subject</p>
	<p class="text-slate-600 font-bold mb-2 text-lg">{data.ticket.subject || "Not Set"}</p>
	<p class="mb-1 text-slate-600 text-sm">Details</p>
	{#if FormatTextArea}
		<svelte:component
			this={FormatTextArea}
			editable={false}
			bind:editor
			text={data.ticket.text || "Not Set"}
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
			<p class="font-bold">{data.ticket?.expand?.category?.name || "Not Set"}</p>
		</div>
		<div class="flex flex-col flex-nowrap gap-1">
			<p class="text-sm">Priority</p>
			<p class="font-bold">{data.ticket?.expand?.priority?.name || "Not Set"}</p>
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
	<form class="mt-2" method="POST" action="?/sendMessage" use:enhance={({ formData }) => {
			formData.append("content", JSON.stringify(messageEditor.getJSON()));
			formData.append("ticket", data.ticket.id);
			return async ({ result }) => {
				await invalidateAll();
				return applyAction(result);
			}
		}
	}>
		<p class="text-sm text-slate-600 mb-1">New Message</p>
		{#if FormatTextArea}
			<svelte:component
				this={FormatTextArea}
				editable={true}
				bind:editor={messageEditor}
				charLimit={2000}
				compact={true}
				bind:text
			/>
		{/if}
		<fieldset class="mt-2 grid grid-cols-1 md:grid-cols-3">
			<button
				  type="submit"
				  class="p-2 md:col-start-3 ml-auto cursor-pointer text-sky-600 hover:text-sky-800 hover:bg-sky-400/20 bg-sky-400/10 hover:border-sky-600 w-full rounded duration-100"
			  >
			  Send Message
			</button>
		  </fieldset>
	</form>
	{#if messages.length}
	<div class="border border-slate-400/40 rounded p-2 mt-2 flex flex-col flex-nowrap gap-4">
		{#key messages}
			{#each messages as message}
				<div class="flex flex-col flex-nowrap bg-slate-300/40 rounded p-1">
					<div class="flex flex-row flex-nowrap items-center gap-2">
						<svg aria-hidden="true" fill="none" class="w-12 text-slate-400/40" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						<div class="flex flex-row flex-nowrap justify-between text-slate-600 gap-2 pr-4 w-full">
							<div class="flex flex-row flex-nowrap gap-2">
								<p class="font-bold leading-4">{message.expand.author.name} <br> <span class="text-sm font-normal">Customer</span></p>
								<p class="text-slate-400 leading-4">{new Date(message.created).toLocaleTimeString()}, {new Date(message.created).toDateString()}</p>
							</div>
							<div class="flex items-center relative">
								<Dropdown displayAsMore={true} topBorder={true} xFromLeft={false} urls={[{text:"Delete Message", emphasis: "danger", form: {action: `?/deleteMessage&id=${message.id}`, method: "POST", async enhance(result) {
									await invalidateAll();
									applyAction(result);
								},}}]}/>
							</div>
						</div>
					</div>
					{#if FormatTextArea}
						<svelte:component
							this={FormatTextArea}
							editable={false}
							border={false}
							text={message.content || "Not Set"}
							charLimit={2000}
						/>
					{/if}
				</div>
			{/each}
		{/key}
	</div>
	{/if}
</div>
