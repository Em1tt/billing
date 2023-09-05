<script lang="ts">
    export let onChange: () => void = () => {};
    export let value: string = "";
    export let name: string;
    export let type: string = "text";
</script>

<input
	on:change={onChange}
	bind:value={value}
	placeholder=" "
	type={type}
	name="password"
	id="password"
	class="p-2 bg-transparent w-full border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer"
/>
<label
	for="password"
	class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3"
	>Password</label
>
