<script>
  import { fade } from "svelte/transition";

  export let error;
</script>

{#if error.length}
  <section
    transition:fade={{ duration: 300 }}
    class="bg-pink-100 text-pink-900 p-2 rounded"
  >
    {error}
  </section>
{/if}
