<script lang="ts">
    import { fade } from 'svelte/transition'
    import { modal, removeModal } from '$lib/modal'
  </script>
  
  {#if $modal}
    <button type="button" on:click={removeModal} class="fixed top-0 left-0 w-screen h-screen bg-black/50"/>
    <div class="block border border-slate-400/40 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-200 rounded">
      <div class="relative">
        <button type="button" on:click={removeModal} class="top-0 right-0 absolute text-slate-600 hover:text-slate-800">X</button>
        <p class="text-slate-600 font-bold text-lg">Viewing Image</p>
        <p class="text-slate-500 text-sm text-ellipsis overflow-hidden max-w-xl">{$modal.name}</p>
        <img src={$modal.url} alt="Attachment" class="rounded mt-2">
      </div>
    </div>
  {/if}