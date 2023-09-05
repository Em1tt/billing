<script lang="ts">
    let selected: string | null | undefined;
    export let defaultText: string;
    export let options: Array<{value: string, text: string, id: string}>
    export let value: string | null | undefined;
    let open: boolean = false;
    function toggleSelect(){
        open = !open;
    }
    function changeText(event: any){
        selected = ((event.currentTarget as HTMLElement).parentElement)?.getAttribute("data-text");
        value = ((event.currentTarget as HTMLElement).parentElement)?.parentElement?.querySelector("input")?.value;
        toggleSelect();
    }
</script>

<div class="flex flex-col flex-nowrap w-full relative">
    <button on:click={toggleSelect} class="py-2 px-3 text-left cursor-pointer bg-transparent w-full border border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-400 focus:text-sky-500 peer">{selected ? selected : defaultText}</button>
    <ul class="border border-slate-400 z-20 rounded mt-0.5 absolute top-full w-full bg-slate-200 {open ? "block" : "hidden"}">
        {#each options as option}
        <li class="flex flex-row hover:bg-slate-300 duration-100 w-full group cursor-pointer">
            <input type="radio" name="category" class="hidden peer" value={option.value} >
            <label for="config" class="cursor-pointer text-slate-600 group-hover:text-slate-800 w-full" data-text={option.text}>
            <button on:click={changeText} class="w-full p-2 text-left">{option.text}</button></label>
        </li>
        {/each}
    </ul>
</div>