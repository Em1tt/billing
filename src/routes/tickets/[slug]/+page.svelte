<script lang="ts">
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
  import Select from '$lib/Select.svelte';
	import TextInput from '$lib/TextInput.svelte';
  import FormatTextArea from '$lib/FormatTextArea.svelte';
  /** @type {import('./$types').PageData} */
  export let data: any;
  console.log(data);
  let priority: string, subject: string, category: string;
  </script>

<Breadcrumbs path={[{text: "Home", path: "/"}, {text: "Tickets", path: "/tickets"}, {text: data.slug}]} />

<h1 class="text-3xl font-bold text-slate-700">Create a ticket</h1>

<form action="" class="flex-col flex-nowrap gap-4">
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
    <FormatTextArea charLimit={2000}/>
  </fieldset>
  <button type="submit">Submit</button>
</form>

<p>Hello</p>