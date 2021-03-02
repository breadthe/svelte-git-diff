<script>
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";

  export let file;
  export let highlight;

  let isCollapsed = false;

  async function highlightPatchAction(node, patch) {
    if (patch) {
      node.innerHTML = await window.Prism.highlight(
        patch,
        window.Prism.languages.diff
      );
    }
  }
</script>

<div>
  <div class="flex flex-col justify-between sm:flex-row sm:items-center">
    <div class="flex items-center space-x-2">
      <a
        href={file.blob_url}
        class="flex items-center space-x-2 font-bold underline"
      >
        <span>
          {file.filename}
        </span>
        <ExternalLinkIcon />
      </a>

      <a
        href="#"
        on:click|preventDefault={() => (isCollapsed = !isCollapsed)}
        class="text-gray-600 hover:text-black text-xs font-bold"
      >
        {isCollapsed ? "expand" : "collapse"}
      </a>
    </div>

    <div>
      <strong>{file.changes}</strong> changes:
      <span class="text-green-600"
        ><strong>{file.additions}</strong>
        additions</span
      >
      +
      <span class="text-red-600"
        ><strong>{file.deletions}</strong> deletions</span
      >
    </div>
  </div>

  {#if !isCollapsed}
    <div>
      <pre
        class="language-diff"
        class:diff-highlight={highlight}>
            <code use:highlightPatchAction={file.patch}></code>
        </pre>
    </div>
  {/if}
</div>

<style>
</style>
