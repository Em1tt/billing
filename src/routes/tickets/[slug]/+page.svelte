<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import Select from '$lib/Select.svelte';
	import TextInput from '$lib/TextInput.svelte';
	import type { Editor } from '@tiptap/core';
  let FormatTextArea: any;
	import { onMount } from 'svelte';
  /** @type {import('./$types').PageData} */
  export let data: any;
  console.log(data);
  let priority: string, subject: string, category: string;
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

<Breadcrumbs path={[{text: "Home", path: "/"}, {text: "Tickets", path: "/tickets"}, {text: data.ticket.id}]} />

<h1 class="text-3xl font-bold text-slate-700">Create a ticket</h1>

<form spellcheck="false" action="" class="flex-col flex-nowrap gap-4" method="POST" use:enhance={({ formData }) => {
  formData.append("priority", priority);
  formData.append("category", category);
  formData.append("content", JSON.stringify(editor.getJSON()));
  return async ({ result }) => {
        await applyAction(result);
      };
}}>
  <fieldset class="grid grid-cols-1 md:grid-cols-3 gap-2">
    <fieldset class="relative mt-3 flex items-center w-full">
      <TextInput bind:value={subject} name="subject" placeholder="Subject"/>
    </fieldset>
    <fieldset class="relative mt-3 flex items-center w-full">
      <Select bind:value={priority} options={[{id: "low", text: "Low", value: "1"}, {id: "medium", text: "Medium", value: "2"}, {id: "high", text: "High", value: "3"}, {id: "critical", text: "Critical", value: "4"}]} defaultText="Priority"/>
    </fieldset>
    <fieldset class="relative mt-3 flex items-center w-full">
      <Select bind:value={category} options={[{id: "billing", text: "Billing", value: "1"}, {id: "service", text: "Service Issues", value: "2"}, {id: "partner", text: "Partnerships", value: "3"}, {id: "other", text: "Other", value: "4"}]} defaultText="Category"/>
    </fieldset>
  </fieldset>
  <fieldset class="relative mt-2 w-full">
    <svelte:component this={FormatTextArea} bind:editor={editor} charLimit={4000}/>
  </fieldset>
  {#if filePreviews.length}
  <fieldset class="relative mt-2 w-full border border-slate-400/40 rounded">
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 p-2">
      {#each filePreviews as preview}
          <img height="200" src={preview} alt="Preview" class="w-full group-hover:brightness-50 rounded overflow-hidden">
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
    Open Ticket
	  </button>
  </fieldset>
</form>