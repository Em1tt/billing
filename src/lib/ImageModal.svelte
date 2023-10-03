<script lang="ts">
    import { fade } from 'svelte/transition'
    import { modal, removeModal } from '$lib/modal'
  </script>
  
  {#if $modal}
    <button type="button" on:click={removeModal} class="fixed top-0 left-0 w-screen h-screen bg-black/50 z-20"/>
    <div class="block border border-slate-400/40 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-200 rounded z-30">
      <div class="relative">
        <button type="button" on:click={removeModal} class="top-0 right-0 absolute text-slate-600 hover:text-slate-800">
          <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <p class="text-slate-600 font-bold text-lg">Viewing Image</p>
        {#if $modal.name}
        <p class="text-slate-500 text-sm text-ellipsis overflow-hidden max-w-xl">{$modal.name}</p>
        {/if}
        <img src={$modal.url} alt="Attachment" class="rounded mt-2 min-w-[256px] min-h-[256px]">
      </div>
    </div>
  {/if}