<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
  export let data: App.Locals;

</script>

{#if data.user}
<p>
  Signed in as {data.user.username} 
</p>
  <form action="/logout" method="POST" use:enhance={() => {
    return async ({ result }) => {
      await applyAction(result);
    };
  }}>
    <button type="submit">Sign Out</button>
  </form>
{/if}