<script>
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";

  export let file;
  export let highlight;

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
    <a
      href={file.blob_url}
      class="flex items-center space-x-2 font-bold text-blue-600 underline"
    >
      <span>
        {file.filename}
      </span>
      <ExternalLinkIcon />
    </a>
    <span>
      <strong>{file.changes}</strong> changes:
      <span class="text-green-600"
        ><strong>{file.additions}</strong>
        additions</span
      >
      +
      <span class="text-red-600"
        ><strong>{file.deletions}</strong> deletions</span
      >
    </span>
  </div>
  <div>
    <pre
      class="language-diff"
      class:diff-highlight={highlight}>
                  <code use:highlightPatchAction={file.patch}></code>
              </pre>
  </div>
</div>

<style>
</style>
