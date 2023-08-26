<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { currentUser, pb } from "$lib/pocketbase";
</script>

{#if $currentUser}
<p>
  Signed in as {$currentUser.username} 
</p>
  <form action="/logout" method="POST" use:enhance={() => {
    return async ({ result }) => {
      await applyAction(result);
      pb.authStore.clear();
    };
  }}>
    <button type="submit">Sign Out</button>
  </form>
{/if}