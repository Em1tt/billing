<script lang="ts">
    let onChange: () => void = () => {
		input.setCustomValidity("");
	};
    export let value: string = "";
    export let name: string;
    export let placeholder: string;
	let input: HTMLInputElement;
	export const setCustomValidity = (error: string) => {
		input.setCustomValidity(error);
	};
</script>

<input
	bind:this={input}
	on:change={onChange}
	bind:value={value}
	placeholder=" "
	type="text"
	name={name}
	id={name}
	class="invalid:border-red-500 invalid:text-red-500 p-2 bg-transparent w-full border border-slate-400 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer"
/>
<label
	for={name}
	class="absolute peer-invalid:text-red-500 pointer-events-none duration-100 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3"
	>{placeholder}</label
>
