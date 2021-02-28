<script>
  import { fade } from "svelte/transition";
  import { dark } from "./store"; // dark mode
  //   import AppearanceToggler from "./AppearanceToggler.svelte";
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";
  import GitHubIcon from "./icons/GitHubIcon.svelte";
  import TwitterIcon from "./icons/TwitterIcon.svelte";

  export let title;
  export let subtitle;

  let org = "laravel";
  let repo = "laravel";
  let from = "8.x";
  let to = "master";

  let hash = "";

  let isFullUrl = false;

  // "2 dots" (direct diff) instead of "3 dots" (diff from last common commit)
  // https://github.com/ORG/REPO/compare/REF1..REF2
  // compare across forks, add ORG2:
  // https://github.com/ORG/REPO/compare/REF1...ORG2:REF2
  $: url = `https://api.github.com/repos/${org}/${repo}/compare/${from}...${to}`;
  $: httpUrl = `https://github.com/${org}/${repo}/compare/${from}...${to}`;
  $: highlightedUrl = `https://github.com/<span class="highlight">${org}</span>/<span class="highlight">${repo}</span>/compare/<span class="highlight">${from}</span>...<span class="highlight">${to}</span>`;
  $: isFullUrl =
    org?.length > 0 && repo?.length > 0 && from?.length > 0 && to?.length > 0;

  let data = {};
  let error = "";

  let highlight = false;

  function getDiff() {
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
        setHash();
      })
      .catch((e) => {
        error = e.message;
      });
  }

  function setHash() {
    window.location.hash = `org=${org}&repo=${repo}&from=${from}&to=${to}`;
  }

  // Example: http://localhost:5000/#org=laravel&repo=laravel&from=8.x&to=master
  function getUrlHashAction(node, params) {
    hash = window.location.hash.substr(1); // org=laravel&repo=laravel&from=8.x&to=master
    const hashObj = Object.fromEntries(
      hash.split("&").map((i) => i.split("="))
    ); // {org: "laravel", repo: "laravel", from: "7.x", to: "8.x"}
    if (hashObj?.org?.length) org = hashObj.org;
    if (hashObj?.repo?.length) repo = hashObj.repo;
    if (hashObj?.from?.length) from = hashObj.from;
    if (hashObj?.to?.length) to = hashObj.to;
  }

  async function highlightPatchAction(node, patch) {
    if (patch) {
      node.innerHTML = await window.Prism.highlight(
        patch,
        window.Prism.languages.diff
      );
    }
  }
</script>

<!-- Note: "class:dark" is equivalent (and short for) "class:dark={dark}" or "class:dark={dark === true}" -->
<main class="p-4 sm:p-8 space-y-8" class:dark use:getUrlHashAction>
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

  <form
    class="flex flex-col justify-start sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0 space-x-0 space-y-4"
    on:submit|preventDefault={getDiff}
  >
    <label class="flex flex-col">
      <strong>Org</strong>
      <input type="text" class="" placeholder="Org" bind:value={org} />
    </label>
    <label class="flex flex-col">
      <strong>Repo</strong>
      <input type="text" class="" placeholder="Repo" bind:value={repo} />
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
        type="submit"
        class="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 border px-4 py-1 rounded text-white"
        disabled={!isFullUrl}
      >
        Diff
      </button>
    </label>
  </form>

  {#if isFullUrl}
    <section transition:fade={{ duration: 300 }} class="overflow-auto">
      <a
        href={httpUrl}
        class="inline-flex items-center space-x-2 underline font-mono"
      >
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
            <label class="inline-flex items-center space-x-1">
              <input type="checkbox" bind:checked={highlight} />
              <span>highlight</span>
            </label>
          </div>

          <div>
            <strong>{data.files.length}</strong>
            files changed
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

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    @apply bg-gray-200;
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
