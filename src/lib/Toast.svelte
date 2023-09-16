<script lang="ts">
    import { fade } from 'svelte/transition'
    import { notifications } from '$lib/notify'
  </script>
  
  {#if $notifications}
    <div class="fixed bottom-4 right-4 w-80 flex flex-col-reverse">
      {#each $notifications as notification}
        <div
          role="alert"
          class="border flex flex-row flex-nowrap {notification.type == "error" ? "border-red-400 bg-red-200 text-red-500" : notification.type == "warn" ? "border-yellow-400 bg-yellow-100 text-yellow-500" : "border-green-400 bg-green-200 text-green-500"} px-4 py-4 rounded text-center mb-1"
          transition:fade
        >
          <div></div>
          {notification.message}
        </div>
      {/each}
    </div>
  {/if}