<script lang="ts">
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Checkbox from '$lib/Checkbox.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	//import { pb } from '$lib/pocketbase';
	import type { Record, UnsubscribeFunc } from 'pocketbase';
	import type { MouseEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	let selectAll: boolean;
	let checkboxes: Array<{ id: string; checked: boolean }> = [];

  let displayShadow: boolean = false;
	let tableWrapper: HTMLElement;
	let loadingTicket: boolean = false;
	let tickets: Array<Record>;
	let unsubscribe: Promise<UnsubscribeFunc>;
	let deleteAction: boolean = false;
  let finishedSearching: boolean = false;

	onMount(async () => {
		/*tickets = (await pb.collection('tickets').getList(0, 20)).items.sort((a, b) => {
			let filter = $page.url.searchParams.get('filter');
			if (!filter) return 0;
			let modFilter = filter?.split('-').filter((i) => i != '')[0];
			if (a[modFilter] < b[modFilter]) return filter.startsWith('-') ? -1 : 1;
			return filter.startsWith('-') ? 1 : -1;
		});*/

    finishedSearching = true;

		mapCheckboxes();

    console.log(tickets);
		/*
		unsubscribe = pb.collection('tickets').subscribe('*', (data) => {
			if (data.action == 'create') {
				tickets = tickets.filter((t) => t.id != data.record.id);
				tickets.push(data.record);
				checkboxes = [];
				mapCheckboxes();
				tickets = tickets.sort((a, b) => {
					let filter = $page.url.searchParams.get('filter');
					if (!filter) return 0;
					let modFilter = filter?.split('-').filter((i) => i != '')[0];
					if (a[modFilter] < b[modFilter]) return filter.startsWith('-') ? -1 : 1;
					return filter.startsWith('-') ? 1 : -1;
				});
			} else if (data.action == 'delete') {
				tickets = tickets.filter((t) => t.id != data.record.id);
				checkboxes = [];
				mapCheckboxes();
			} else if (data.action == 'update') {
				tickets = tickets.filter((t) => t.id != data.record.id);
				tickets.push(data.record);
				checkboxes = [];
				mapCheckboxes();
				tickets = tickets.sort((a, b) => {
					let filter = $page.url.searchParams.get('filter');
					if (!filter) return 0;
					let modFilter = filter?.split('-').filter((i) => i != '')[0];
					if (a[modFilter] < b[modFilter]) return filter.startsWith('-') ? -1 : 1;
					return filter.startsWith('-') ? 1 : -1;
				});
			}
		});
		if (window) {
			window.onresize = () => {
				displayShadow = tableWrapper.scrollWidth > tableWrapper.clientWidth;
			};
		}
		*/
	});

	onDestroy(async () => {
		(await unsubscribe)?.();
	});

  async function redirectTicket(
		id: string
	): Promise<MouseEventHandler<HTMLTableRowElement> | null | undefined> {
		await goto(`/tickets/${id}`);
		return;
	}

	async function handleFilter(filter: string) {
		let modFilter = filter;
		if (
			$page.url.searchParams.get('filter') == filter &&
			!$page.url.searchParams.get('filter')?.startsWith('-')
		)
			modFilter = `-${filter}`;
		$page.url.searchParams.set('filter', modFilter);
		tickets = tickets.sort((a, b) => {
			let filter = $page.url.searchParams.get('filter');
			if (!filter) return 0;
			let modFilter = filter?.split('-').filter((i) => i != '')[0];
			if (a[modFilter] < b[modFilter]) return filter.startsWith('-') ? -1 : 1;
			return filter.startsWith('-') ? 1 : -1;
		});
		return await goto(`?${$page.url.searchParams.toString()}`);
	}

	async function deleteSelected() {
		const toDelete = checkboxes.filter((i) => i.checked).map((i) => i.id);
		for (let i = 0; i < toDelete.length; i++) {
			//await pb.collection('tickets').delete(toDelete[i]);
			checkboxes = checkboxes.filter((p) => p.id != toDelete[i]);
		}
		deleteAction = false;
		selectAll = false;
	}

  function changeAll() {
		const checked = !selectAll;
		if (checked) {
			deleteAction = true;
		} else {
			deleteAction = false;
		}
		checkboxes = checkboxes.map((checkbox) => {
			return { id: checkbox.id, checked };
		});
	}
  
  function change() {
		// TODO: Make this work without timeout
		setTimeout(() => {
			if (checkboxes.every((v) => v.checked === true)) {
				selectAll = true;
				deleteAction = true;
			} else if (checkboxes.some((v) => v.checked === true)) {
				selectAll = false;
				deleteAction = true;
			} else {
				selectAll = false;
				deleteAction = false;
			}
		}, 1);
	}

	function mapCheckboxes() {
		tickets.map((ticket, i) => {
			checkboxes[i] = { id: ticket.id, checked: false };
		});
	}
</script>

<Breadcrumbs path={[{ text: 'Home', path: '/' }, { text: 'Tickets' }]} />
<!--HEAVILY INSPIRED BY POCKETBASE-->
{#if deleteAction}
	<div
		transition:fly={{ duration: 200, y: 10 }}
		class="shadow fixed bottom-20 left-1/2 -translate-x-1/2 justify-between border border-slate-400/40 rounded-full w-96 flex items-center px-6 py-2"
	>
		<p class="text-slate-600">
			Selected <b>{checkboxes.filter((t) => t.checked === true).length}</b>
			ticket{checkboxes.filter((t) => t.checked === true).length > 1 ? 's' : ''}
		</p>
		<button
			on:click={deleteSelected}
			class="p-2 cursor-pointer text-red-600 duration-100 hover:bg-red-400/20 px-4 rounded"
			>Delete selected</button
		>
	</div>
{/if}

<div class="flex justify-between">
	<h1 class="text-3xl font-bold text-slate-700">Tickets</h1>
	<div class="flex gap-6 items-center">
		<div class="relative">
			<div class="peer flex flex-row flex-nowrap items-center gap-2">
				<span
					class="animate-ping motion-reduce:hidden block h-2 w-2 rounded-full bg-red-500 opacity-75 absolute mt-0.5"
				/>
				<span class="block h-2 w-2 rounded-full bg-red-500 opacity-75 mt-0.5" />
				<p class="text-red-500 flex items-center">Live</p>
			</div>
			<div
				class="hidden peer-hover:block absolute bottom-10 right-3 border border-sky-400 py-1 px-2 pointer-events-none bg-sky-200 rounded rounded-br-none w-fit max-w-[240px]"
			>
				<p class="text-sm block min-w-[120px] text-sky-500">
					This page updates automatically whenever a change occurs.
				</p>
				<div class="relative">
					<div
						class="absolute h-2 w-2 border-t-8 border-l-8 border-r-0 border-b-0 border-transparent border-t-sky-400 top-1 -right-[9px]"
					/>
				</div>
			</div>
		</div>
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
				class="p-2 cursor-pointer bg-sky-200 border border-sky-400 text-sky-600 hover:text-sky-800 hover:border-sky-600 rounded w-40"
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
						onCheck={changeAll}
						name="select-all"
					/>
				</th>
				<th
					on:click={() => {
						handleFilter('subject');
					}}
					class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
					>Subject</th
				>
				<th
					on:click={() => {
						handleFilter('priority');
					}}
					class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
					>Priority</th
				>
				<th
					on:click={() => {
						handleFilter('status');
					}}
					class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
					>Status</th
				>
				<th
					on:click={() => {
						handleFilter('created');
					}}
					class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
					>Created</th
				>
				<th
					on:click={() => {
						handleFilter('lastReply');
					}}
					class="text-left hover:bg-slate-300 px-2 cursor-pointer hover:text-slate-600 rounded-t"
					>Last Reply</th
				>
				<th
					class="px-4 right-0 sticky bg-slate-200 {displayShadow ? "arrow" : ""} transition-colors border-b border-slate-400/40 group-hover:bg-slate-300 duration-100"
				/>
			</tr>
		</thead>
		<tbody>
			{#if tickets?.length}
				{#key tickets}
					{#each tickets as ticket, index}
						<tr
							on:click={async () => {
								await redirectTicket(ticket.id);
							}}
							class="hover:bg-slate-300 cursor-pointer duration-100 border-b border-slate-400/40 group"
						>
							<td
								on:click|stopPropagation
								class="flex items-center px-8 whitespace-nowrap h-[3rem] mt-1"
							>
								<Checkbox
									onCheck={change}
									bind:checked={checkboxes[index].checked}
									name={ticket.id}
								/>
							</td>
							<td class="px-2 whitespace-nowrap overflow-ellipsis overflow-hidden"
								>#{ticket.id} - {ticket.subject == '' ? 'Not set' : ticket.subject}</td
							>
							<!--
          0 - Unset;
          1 - Low;
          2 - Medium;
          3 - High;
          4 - Critical 
        -->
							<td class="px-2">
								{ticket.priority
									? ticket.priority == 1
										? 'Low'
										: ticket.priority == 2
										? 'Medium'
										: ticket.priority == 3
										? 'High'
										: 'Critical'
									: 'Not set'}
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
							<td class="px-2">
								{#if ticket.lastReply}
									... time ago
								{:else}
									N/A
								{/if}
							</td>
							<td
								class="px-4 right-0 sticky bg-slate-200 {displayShadow ? "arrow" : ""} transition-colors border-b border-slate-400/400 group-hover:bg-slate-300 duration-100"
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
				{/key}
			{:else}
            <tr>
              <td class="text-center leading-10 py-6" colspan="7">
                {#if finishedSearching}
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
		</tbody>
	</table>
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
