<script lang="ts">
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Checkbox from '$lib/Checkbox.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import type { Record, ListResult } from 'pocketbase';
	import type { MouseEventHandler } from 'svelte/elements';
	import {browser} from "$app/environment"

	interface Ticket extends Record {
		expand: {[any: string]: Record};
	}

	export let data;
	console.log(data);
	let selectAll : boolean,
		checkboxes: Array<{ id: string; checked: boolean }> = [],
		   tickets: Ticket[],
	 displayShadow: boolean = false,
	  tableWrapper: HTMLElement,
	 loadingTicket: boolean = false,
	   deleteModal: boolean = false;

	$: if(data){
		const resultData: ListResult<Ticket> = data.tickets;
		tickets = resultData.items.sort(tableSort);
		mapCheckboxes();
	};

	function handleTableShadow(){
		displayShadow = tableWrapper?.scrollWidth > tableWrapper?.clientWidth;
	}

	onMount(async () => {
		if (browser) {
			window.addEventListener("resize", handleTableShadow);
		};
	});
	onDestroy(async () => {
		if(browser){
			window.removeEventListener("resize", handleTableShadow);
		}
	})

	function tableSort(a: Ticket, b: Ticket){
		//Uses custom function because this allows for deep sort based on weight values of DB relation attributes
		const sortBy = $page.url.searchParams.get('sortBy');
		let sortProperty = "created";
		let inverse = false;
		if(sortBy){
			inverse = sortBy.startsWith("-");
			sortProperty = inverse ? sortBy.slice(1) : sortBy;
		};
		if(a.expand[sortProperty] && b.expand[sortProperty]){
			return (a.expand[sortProperty].weight < b.expand[sortProperty].weight ? 1 : -1) * (inverse ? -1 : 1);
		}else if(a.expand[sortProperty] && !b.expand[sortProperty]){
			return (a.expand[sortProperty].weight < 0 ? 1 : -1) * (inverse ? -1 : 1);
		}else if(!a.expand[sortProperty] && b.expand[sortProperty]){
			return (0 < b.expand[sortProperty].weight ? 1 : -1) * (inverse ? -1 : 1);
		}else{
			return (a[sortProperty] > b[sortProperty] ? 1 : -1) * (inverse ? -1 : 1) * (isNaN(parseInt(a[sortProperty])) && isNaN(parseInt(b[sortProperty])) ? 1 : -1);
		}
	}

	async function redirectToTicket(
		id: string
	): Promise<MouseEventHandler<HTMLTableRowElement> | null | undefined> {
		await goto(`/tickets/${id}`);
		return;
	}

	async function handleSortProperty(filter: string) {
		//This function puts the current sort property into the URL, and makes sure that this can be an inverse sort or normal sort by pre-pending a - to the sort property.
		let modFilter = filter;
		if ($page.url.searchParams.get('sortBy') == filter && !$page.url.searchParams.get('sortBy')?.startsWith('-')) modFilter = `-${filter}`;
		$page.url.searchParams.set('sortBy', modFilter);
		tickets = tickets.sort(tableSort);
		return await goto(`?${$page.url.searchParams.toString()}`);
	}

	async function deleteSelected() {
		//Rerun the load function, repopulates the data property
		await invalidateAll();
		//Closes the modal
		deleteModal = false;
		selectAll = false;
		//Remaps the checkboxes
		mapCheckboxes();
	}

  function handleMassCheckboxUpdate() {
		const checked = !selectAll;
		if (checked) {
			deleteModal = true;
		} else {
			deleteModal = false;
		}
		checkboxes = checkboxes.map((checkbox) => {
			return { id: checkbox.id, checked };
		});
	}
  
  function handleCheckboxUpdate() {
		// TODO: This function doesn't work without this timeout for some reason? Without timeout, the logic of this function is delayed by one checkbox update;
		setTimeout(() => {
			if (checkboxes.every((v) => v?.checked === true)) {
				selectAll = true;
				deleteModal = true;
			} else if (checkboxes.some((v) => v?.checked === true)) {
				selectAll = false;
				deleteModal = true;
			} else {
				selectAll = false;
				deleteModal = false;
			}
		}, 1);
	};

	function mapCheckboxes() {
		//Reset checkbox array;
		checkboxes = [];
		//Remap checkboxes into array;
		tickets.map((ticket, i) => {
			checkboxes[i] = { id: ticket.id, checked: false };
		});
	}
</script>

<Breadcrumbs path={[{ text: 'Home', path: '/' }, { text: 'Tickets' }]} />
<!--HEAVILY INSPIRED BY POCKETBASE-->
{#if deleteModal}
	<div
		transition:fly={{ duration: 200, y: 10 }}
		class="shadow fixed bottom-20 left-1/2 -translate-x-1/2 justify-between border border-slate-400/40 rounded-full w-96 flex items-center px-6 py-2"
	>
		<p class="text-slate-600">
			Selected <b>{checkboxes.filter((t) => t?.checked === true).length}</b>
			ticket{checkboxes.filter((t) => t?.checked === true).length > 1 ? 's' : ''}
		</p>
		<button
			form="ticketSelect"
			type="submit"
			on:click={deleteSelected}
			class="p-2 cursor-pointer text-red-600 duration-100 hover:bg-red-400/20 px-4 rounded"
			>Delete selected</button
		>
	</div>
{/if}

<div class="flex justify-between">
	<h1 class="text-3xl font-bold text-slate-700">Tickets</h1>
	<div class="flex gap-6 items-center">
		<form
			action="?/createTicket"
			method="POST"
			use:enhance={() => {
				loadingTicket = true;
				return async ({ result }) => {
					await applyAction(result);
					loadingTicket = false;
				};
			}}
		>
			<button
				type="submit"
				class="p-2 cursor-pointer text-sky-500 hover:bg-sky-400/20 rounded px-4"
			>
				{#if loadingTicket}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 mx-auto animate-spin"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				{:else}
					Create a new ticket
				{/if}
			</button>
		</form>
	</div>
</div>
<div bind:this={tableWrapper} class="overflow-auto">
	<form
		id="ticketSelect"
		action="?/removeTickets"
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				await applyAction(result);
				await invalidateAll();
			};
		}}
	>
		<table class="w-full mt-8 leading-[3rem] text-slate-500 border-separate" cellspacing="0">
			<colgroup>
				<col class="w-10" />
				<col class="w-auto min-w-[200px]" />
				<col class="w-auto min-w-[160px]" />
				<col class="w-auto min-w-[160px]" />
				<col class="w-auto min-w-[160px]" />
				<col class="w-auto min-w-[160px]" />
				<col class="w-12" />
			</colgroup>
			<thead>
				<tr>
					<th class="flex items-center px-8 whitespace-nowrap h-[3rem] mt-1">
						<Checkbox
							disabled={!Boolean(tickets?.length)}
							bind:checked={selectAll}
							onCheck={handleMassCheckboxUpdate}
							name="select-all"
						/>
					</th>
					<th
						on:click={() => {
							handleSortProperty('subject');
						}}
						class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
						>Subject</th
					>
					<th
						on:click={() => {
							handleSortProperty('category');
						}}
						class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
						>Category</th
					>
					<th
						on:click={() => {
							handleSortProperty('priority');
						}}
						class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
						>Priority</th
					>
					<th
						on:click={() => {
							handleSortProperty('status');
						}}
						class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
						>Status</th
					>
					<th
						on:click={() => {
							handleSortProperty('created');
						}}
						class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
						>Created</th
					>
					<th
						class="px-4 right-0 sticky bg-slate-200 {displayShadow
							? 'arrow'
							: ''} transition-colors border-b border-slate-400/40 group-hover:bg-slate-300 duration-100"
					/>
				</tr>
			</thead>
			<tbody>
				{#if tickets?.length}
					{#each tickets as ticket, index}
						<tr
							on:click={async () => {
								await redirectToTicket(ticket.id);
							}}
							class="hover:bg-slate-300 cursor-pointer duration-100 border-b border-slate-400/40 group"
						>
							<td
								on:click|stopPropagation
								class="flex items-center px-8 whitespace-nowrap h-[3rem] mt-1"
							>
								<Checkbox
									onCheck={handleCheckboxUpdate}
									bind:checked={checkboxes[index].checked}
									name={ticket.id}
								/>
							</td>
							<td class="px-2 whitespace-nowrap overflow-ellipsis overflow-hidden"
								>#{ticket.id} - {ticket.subject == '' ? 'Not set' : ticket.subject}</td
							>
							<td class="px-2">
								{#if ticket.expand.category?.name}
									{ticket.expand.category.name}
								{:else}
									Not set
								{/if}
							</td>
							<td class="px-2">
								{#if ticket.expand.priority?.name}
									{ticket.expand.priority.name}
								{:else}
									Not set
								{/if}
							</td>
							<td class="px-2">
								<!--
          0 - Draft;
          1 - Open;
          2 - Awaiting Client Res;
          3 - Awaiting Staff Res;
          4 - Closed by Client
          5 - Closed by Staff
        -->
								{#if ticket.status == 0}
									<span
										class="px-2 py-1 rounded bg-gray-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
										>Draft</span
									>
								{:else if ticket.status == 1}
									<span
										class="px-2 py-1 rounded bg-green-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
										>Open</span
									>
								{:else if ticket.status == 2}
									<span
										class="px-2 py-1 rounded bg-yellow-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
										>Awaiting Client Response</span
									>
								{:else if ticket.status == 3}
									<span
										class="px-2 py-1 rounded bg-orange-500 text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
										>Awaiting Staff Response</span
									>
								{:else if ticket.status == 4}
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
							</td>
							<td class="px-2">
								<div class="flex flex-col gap-0">
									<p class="leading-5">{new Date(ticket.created).toDateString()}</p>
									<p class="leading-5 text-sm text-slate-400">
										{new Date(ticket.created).toLocaleTimeString()}
									</p>
								</div>
							</td>
							<td
								class="px-4 right-0 sticky bg-slate-200 {displayShadow
									? 'arrow'
									: ''} transition-colors border-b border-slate-400/400 group-hover:bg-slate-300 duration-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										fill-rule="evenodd"
										d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
										clip-rule="evenodd"
									/>
								</svg>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td class="text-center leading-10 py-6" colspan="7">
							{#if !tickets.length}
								<p>No tickets found.</p>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 mx-auto animate-spin"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
							{/if}
						</td>
					</tr>
				{/if}
				{#if data.tickets.page < data.tickets.totalPages}
					<tr>
						<td class="text-center leading-10 py-2" colspan="7">
							<button
								type="submit"
								class="cursor-pointer text-black bg-gray-400/20 hover:bg-gray-400/40 rounded px-4"
							>
								{#if loadingTicket}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6 mx-auto animate-spin"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
								{:else}
									Load more ({data.tickets.totalItems - data.tickets.items.length})
								{/if}
							</button>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</form>
</div>

<style>
	th,
	td:not(.ignoreBorder) {
		@apply border-b border-slate-400/40;
	}
	.arrow {
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
		clip-path: inset(0px -15px 0px -15px);
	}
</style>
