<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Dropdown from '$lib/Dropdown.svelte';
  import Select from '$lib/Select.svelte';
	import TextInput from '$lib/TextInput.svelte';
	import { shootImageModal } from '$lib/modal';
	import { toast } from '$lib/notify';
	import type { Editor } from '@tiptap/core';
  let FormatTextArea: any,
    validateSubject: (error: string) => void,
    validateText: boolean,
    validatePriority: boolean,
    validateCategory: boolean;
	import { onMount } from 'svelte';
  /** @type {import('./$types').PageData} */
  export let data: any;
  let priority: string = data?.ticket.priority,
       subject: string = data.ticket.subject.trim(),
      category: string = data.ticket.category,
      textLength: string;
  onMount(async () => {
		FormatTextArea = (await import('$lib/FormatTextArea.svelte')).default;
	});
  let files: FileList | null;
  let input: HTMLInputElement; 
  let filePreviews: Array<string> = data.ticket.attachments.map((i: string) => `${PUBLIC_POCKETBASE_URL}${data.ticket.collectionId}/${data.ticket.id}/${i}?token=${data.token}`);
  let editor: Editor;
	$: if(files){
    filePreviews = [];
		for (const file of files) {
      filePreviews.push(URL.createObjectURL(file));
		}
  };
  function clearFiles(){
    input.value = '';
    files = null;
    filePreviews = [];
  };
  </script>

<Breadcrumbs path={[{text: "Home", path: "/"}, {text: "Tickets", path: "/tickets"}, {text: data.ticket.id, path: `/tickets/${data.ticket.id}`}, {text: "Edit"}]} />
<div class="flex content-between flex-nowrap">
  <h1 class="text-3xl font-bold text-slate-700">
    {parseInt(data.ticket.status) == 0 ? "Create a ticket" : "Edit a ticket"}
  </h1>
  <div class="ml-auto items-center relative flex">
    <Dropdown displayAsMore={true} topBorder={true} xFromLeft={false} urls={[{text: "View Tickets", url:"/tickets", emphasis: "danger", form: {action: "?/close", method: "POST"}}, {text: "Join our Discord", url: "/"}]}/>
  </div>
</div>

<form enctype="multipart/form-data" spellcheck="false" action="?/editTicket" class="flex-col flex-nowrap gap-4 mt-2" method="POST" use:enhance={({ formData }) => {
  formData.append("priority", priority);
  formData.append("category", category);
  formData.append("content", JSON.stringify(editor.getJSON()));
  formData.append("contentLength", textLength);
  formData.append("status", data.ticket.status);
  return async ({ result }) => {
      if((result.type == "success")){
        if(result.data?.success){
          toast("Successfully opened ticket.", "success", 3000);
          goto(`/tickets/${data.ticket.id}`);
        }else if(result.data?.subject){
          toast("Subject is required to open the ticket", "error", 3000);
          validateSubject("Cannot be empty");
        }else if(result.data?.text){
          toast("Ticket content must be at least 40 characters long to open the ticket", "error", 4000);
          validateText = true;
        }else if(result.data?.category){
          toast("Category has to be selected to open the ticket", "error", 3000);
          validateCategory = true;
        }else if(result.data?.priority){
          toast("Priority has to be selected to open the ticket", "error", 3000);
          validatePriority = true;
        };
      };
        await applyAction(result);
      };
}}>
  <fieldset class="grid grid-cols-1 md:grid-cols-3 gap-2">
    <fieldset class="relative mt-3 flex items-center w-full">
      <TextInput bind:setCustomValidity={validateSubject} bind:value={subject} name="subject" placeholder="Subject"/>
    </fieldset>
    <fieldset class="relative mt-3 flex items-center w-full">
      <Select selected={data?.ticket?.expand?.priority?.name} bind:value={priority} bind:invalid={validatePriority} options={data.priorities} defaultText="Priority"/>
    </fieldset>
    <fieldset class="relative mt-3 flex items-center w-full">
      <Select selected={data.ticket?.expand?.category?.name} bind:value={category} bind:invalid={validateCategory} options={data.categories} defaultText="Category"/>
    </fieldset>
  </fieldset>
  <fieldset class="relative mt-2 w-full">
    {#if FormatTextArea}
    <svelte:component this={FormatTextArea} bind:invalid={validateText} bind:charCount={textLength} bind:editor={editor} text={data.ticket.text} charLimit={4000}/>
    {:else}
    <div class="border border-slate-400/40 h-[540px] w-full bg-slate-200 rounded overflow-hidden grid place-items-center">
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
    </div>
    {/if}
  </fieldset>
  {#if filePreviews.length}
  <fieldset class="relative mt-2 w-full border border-slate-400/40 rounded">
    <div class="flex flex-row flex-wrap gap-2 p-2">
      {#each filePreviews as file, i}
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
  </fieldset>
  {/if}
  <fieldset class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
    <input accept="image/*" bind:this={input} bind:files type="file" multiple class="hidden" id="files" name="files">
    <label class="p-2 cursor-pointer bg-amber-200 border border-amber-400 text-amber-600 hover:text-amber-800 hover:border-amber-600 text-center w-full rounded block" for="files">Add Files</label>
    <div>
      {#if filePreviews.length}
      <button
        on:click={clearFiles}
        type="button"
        class="p-2 cursor-pointer bg-red-200 border border-red-400 text-red-600 hover:text-red-800 hover:border-red-600 w-full rounded"
      >
      Clear attachments
      </button>
      {/if}
    </div>
    <button
		  type="submit"
		  class="p-2 ml-auto cursor-pointer bg-sky-200 border border-sky-400 text-sky-600 hover:text-sky-800 hover:border-sky-600 w-full rounded"
	  >
    {#if data.ticket.status == 0}
      Open Ticket
    {:else}
      Edit Ticket
    {/if}
	  </button>
  </fieldset>
</form>