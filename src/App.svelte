<script>
  import { fade } from "svelte/transition";
  import { dark } from "./store"; // dark mode
  //   import AppearanceToggler from "./AppearanceToggler.svelte";
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";
  import GitHubIcon from "./icons/GitHubIcon.svelte";
  import TwitterIcon from "./icons/TwitterIcon.svelte";

  export let title;
  export let subtitle;

  let vendor = "laravel";
  let repo = "laravel";
  let from = "8.x";
  let to = "master";

  let isFullUrl = false;

  $: url = `https://api.github.com/repos/${vendor}/${repo}/compare/${from}...${to}`;
  $: httpUrl = `https://github.com/${vendor}/${repo}/compare/${from}...${to}`;
  $: highlightedUrl = `https://github.com/<span class="highlight">${vendor}</span>/<span class="highlight">${repo}</span>/compare/<span class="highlight">${from}</span>...<span class="highlight">${to}</span>`;
  $: isFullUrl =
    vendor.length > 0 && repo.length > 0 && from.length > 0 && to.length > 0;

  let data = {};
  let error = "";

  let highlight = false;

  function clickMe() {
    data = {};
    error = "";
    fetch(url)
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `GitHub returned ${response.status} - make sure the URL is valid`
          );
        }
      })
      .then((responseData) => {
        data = responseData;
      })
      .catch((e) => {
        error = e.message;
      });
  }

  async function highlightPatchAction(node, patch) {
    if (patch) {
      node.innerHTML = window.Prism.highlight(
        patch,
        window.Prism.languages.diff
      );
    }
  }
</script>

<!-- Note: "class:dark" is equivalent (and short for) "class:dark={dark}" or "class:dark={dark === true}" -->
<main class="p-4 sm:p-8 space-y-8" class:dark>
  <section class="flex items-center justify-between">
    <div>
      <h1 class="">{title}</h1>
      <h2 class="text-gray-600">{subtitle}</h2>
    </div>
    <div class="flex space-x-4">
      <a href="https://github.com/breadthe/svelte-git-diff" class="group">
        <GitHubIcon />
      </a>
      <a href="https://twitter.com/brbcoding/" class="group">
        <TwitterIcon />
      </a>
    </div>
    <!-- <AppearanceToggler /> -->
  </section>

  <section
    class="flex flex-col justify-start sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0 space-x-0 space-y-4"
  >
    <label class="flex flex-col">
      <strong>Vendor</strong>
      <input type="text" class="" placeholder="Vendor" bind:value={vendor} />
    </label>
    <label class="flex flex-col">
      <strong>Repository</strong>
      <input type="text" class="" placeholder="Repository" bind:value={repo} />
    </label>
    <label class="flex flex-col">
      <strong>From <small>(branch, commit, tag)</small></strong>
      <input
        type="text"
        class=""
        placeholder="From (branch, commit, tag)"
        bind:value={from}
      />
    </label>
    <label class="flex flex-col">
      <strong>To <small>(branch, commit, tag)</small></strong>
      <input
        type="text"
        class=""
        placeholder="To (branch, commit, tag)"
        bind:value={to}
      />
    </label>

    <label for="diff-butt">
      <button
        id="diff-butt"
        type="button"
        class="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 border px-4 py-1 rounded text-white"
        on:click={() => clickMe()}
        disabled={!isFullUrl}
      >
        Diff
      </button>
    </label>
  </section>

  {#if isFullUrl}
    <section transition:fade={{ duration: 300 }} class="overflow-auto">
      <a href={httpUrl} class="flex items-center space-x-2 underline font-mono">
        <span>{@html highlightedUrl}</span>
        <ExternalLinkIcon />
      </a>
    </section>
  {/if}

  {#if error.length}
    <section
      transition:fade={{ duration: 300 }}
      class="bg-pink-100 text-pink-900 p-2 rounded"
    >
      {error}
    </section>
  {/if}

  <section>
    {#await data}
      WAIT
    {:then data}
      {#if data?.files?.length}
        <div class="bg-white space-y-8">
          <div class="bg-gray-200 p-2 rounded">
            <label class="flex items-center space-x-1">
              <input type="checkbox" bind:checked={highlight} />
              <span>highlight</span>
            </label>
          </div>

          {#each data.files as file}
            <div>
              <div
                class="flex flex-col justify-between sm:flex-row sm:items-center"
              >
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
          {/each}
        </div>
      {/if}
    {/await}
  </section>
</main>

<style>
  h1 {
    @apply text-3xl font-bold;
  }

  input {
    @apply border border-gray-600 rounded px-2 py-1;
  }

  small {
    @apply text-xs text-gray-600;
  }

  a {
    color: blue;
  }

  .highlight {
    border-radius: 1em 0 1em 0;
    background-image: linear-gradient(
      -100deg,
      rgba(255, 224, 0, 0.3),
      rgba(255, 224, 0, 0.7) 95%,
      rgba(255, 224, 0, 0.1)
    );
  }
</style>
