<script lang="ts">
    export let selected: string = "";
    export let defaultText: string;
    function onChange(event: any) {
		selected = event.currentTarget.value;
        console.log(selected);
	}
</script>

<div class="flex flex-col flex-nowrap w-full relative">
    <button class="p-2 text-left cursor-pointer bg-transparent w-full border border-slate-400 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer">{selected == "" ? defaultText : selected}</button>
    <ul class="border border-slate-400 rounded mt-0.5 peer-focus-within:block absolute top-full w-full bg-slate-200">
        <li class="flex flex-row hover:bg-slate-300 duration-100 w-full group cursor-pointer">
            <input on:change={onChange} type="radio" id="config" name="category" class="hidden peer" value="1" >
            <label for="config" class="p-2 peer-checked:text-green-500 cursor-pointer text-slate-600 group-hover:text-slate-800 w-full">Configuration Issues</label>
        </li>
        <li class="flex flex-row hover:bg-slate-300 duration-100 w-full group cursor-pointer">
            <input on:change={onChange} type="radio" id="billing" name="category" class="hidden peer" value="2" >
            <label for="billing" class="p-2 peer-checked:text-green-500 cursor-pointer text-slate-600 group-hover:text-slate-800 w-full">Billing Issues</label>
        </li>
    </ul>
</div>