<script lang="ts">
	import { currentUser, pb } from "$lib/pocketbase";

  function signOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentUser}
<p>
  Signed in as {$currentUser.username} 
  <button on:click={signOut}>Sign Out</button>
</p>
{/if}