<script lang="ts">
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import Select from '$lib/Select.svelte';
	import TextInput from '$lib/TextInput.svelte';
  let FormatTextArea: any;
	import { onMount } from 'svelte';
  /** @type {import('./$types').PageData} */
  export let data: any;
  console.log(data);
  let priority: string, subject: string, category: string;
  onMount(async () => {
		FormatTextArea = (await import('$lib/FormatTextArea.svelte')).default;
	});
  let files: FileList;
  let filePreviews: Array<string> = [];
	$: if(files){
		console.log(files);
    filePreviews = [];
		for (const file of files) {
      filePreviews.push(URL.createObjectURL(file));
			console.log(`${file.name}: ${file.size} bytes`);
      console.log(filePreviews);
		}
  }
  </script>

<Breadcrumbs path={[{text: "Home", path: "/"}, {text: "Tickets", path: "/tickets"}, {text: data.slug}]} />

<h1 class="text-3xl font-bold text-slate-700">Create a ticket</h1>

<form spellcheck="false" action="" class="flex-col flex-nowrap gap-4">
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
    <svelte:component this={FormatTextArea} charLimit={4000}/>
  </fieldset>
  <fieldset class="relative mt-2 w-full">
    <div class="border border-slate-400/40 rounded">
      <input bind:files type="file" multiple>
      {#each filePreviews as preview}
        <img height="200" src={preview} alt="Preview" class="rounded overflow-hidden">
      {/each}
    </div>
  </fieldset>
  <fieldset class="relative mt-3 flex items-center w-80">
    <button
		  type="submit"
		  class="p-2 cursor-pointer bg-sky-200 border border-sky-400 text-sky-600 hover:text-sky-800 hover:border-sky-600 w-full rounded"
	  >
	  Submit
	  </button>
  </fieldset>
</form>