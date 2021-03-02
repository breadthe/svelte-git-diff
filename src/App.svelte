<script>
  import { tick } from "svelte";
  import { fade } from "svelte/transition";
  import { dark } from "./store"; // dark mode
  //   import AppearanceToggler from "./AppearanceToggler.svelte";
  import Error from "./Error.svelte";
  import File from "./File.svelte";
  import Header from "./Header.svelte";
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";

  export let title;
  export let subtitle;

  let org, repo, base, head; // Example: laravel laravel 8.x master
  const example = {
    org: "laravel",
    repo: "laravel",
    base: "8.x",
    head: "master",
  };

  let hash = ""; // Example: #org=laravel&repo=laravel&base=8.x&head=master
  let isFullUrl = false; // is the GitHub URL complete (has all the params)?
  let data = {}; // API data
  let error = ""; // fetch error
  let isCollapsedAll = false; // toggle collapsing all files
  let highlight = false; // highlight the parameters of the GitHub URL

  // "2 dots" (direct diff) instead of "3 dots" (diff from last common commit)
  // https://github.com/ORG/REPO/compare/REF1..REF2
  // compare across forks, add ORG2:
  // https://github.com/ORG/REPO/compare/REF1...ORG2:REF2
  $: url = `https://api.github.com/repos/${org}/${repo}/compare/${base}...${head}`;
  $: httpUrl = `https://github.com/${org}/${repo}/compare/${base}...${head}`;
  $: highlightedUrl = `https://github.com/<span class="highlight">${org}</span>/<span class="highlight">${repo}</span>/compare/<span class="highlight">${base}</span>...<span class="highlight">${head}</span>`;
  $: isFullUrl =
    org?.length > 0 && repo?.length > 0 && base?.length > 0 && head?.length > 0;
  $: placeholderUrl = `https://github.com/
    <span class="highlight">${org?.length ? org : "&lt;org&gt;"}</span>/
    <span class="highlight">${
      repo?.length ? repo : "&lt;repo&gt;"
    }</span>/compare/
    <span class="highlight">${base?.length ? base : "&lt;base&gt;"}</span>...
    <span class="highlight">${
      head?.length ? head : "&lt;head&gt;"
    }</span>`.replaceAll(/\s{2,5}/g, "");

  function getDiff() {
    data = callApi();
  }

  async function callApi() {
    if (!isFullUrl) return;

    const response = await fetch(url);
    const json = await response.json();

    if (response.ok) {
      error = "";
      setHash();

      return json;
    }

    error = `GitHub returned ${response.status} - make sure the URL is valid`;
    return;
  }

  function setHash() {
    window.location.hash = `org=${org}&repo=${repo}&base=${base}&head=${head}`;
  }

  // Example: http://localhost:5000/#org=laravel&repo=laravel&base=8.x&head=master
  async function getUrlHashAction(node, params) {
    hash = window.location.hash.substr(1); // org=laravel&repo=laravel&base=8.x&head=master
    const hashObj = Object.fromEntries(
      hash.split("&").map((i) => i.split("="))
    ); // {org: "laravel", repo: "laravel", base: "8.x", head: "master"}
    if (hashObj?.org?.length) org = hashObj.org;
    if (hashObj?.repo?.length) repo = hashObj.repo;
    if (hashObj?.base?.length) base = hashObj.base;
    if (hashObj?.head?.length) head = hashObj.head;

    await tick();

    getDiff();
  }

  function populateWithExample() {
    ({ org, repo, base, head } = { ...example });
  }
</script>

<!-- Note: "class:dark" is equivalent (and short for) "class:dark={dark}" or "class:dark={dark === true}" -->
<main class="p-4 sm:p-8 space-y-8" class:dark use:getUrlHashAction>
  <Header {title} {subtitle} />

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
      <strong>Base <small>(branch, commit, tag)</small></strong>
      <input
        type="text"
        placeholder="Base (branch, commit, tag)"
        bind:value={base}
      />
    </label>
    <label class="flex flex-col">
      <strong>Head <small>(branch, commit, tag)</small></strong>
      <input
        type="text"
        placeholder="Head (branch, commit, tag)"
        bind:value={head}
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

  <section transition:fade={{ duration: 300 }} class="overflow-auto">
    {#if isFullUrl}
      <a
        href={httpUrl}
        class="inline-flex items-center space-x-2 underline font-mono"
      >
        <span>{@html highlightedUrl}</span>
        <ExternalLinkIcon />
      </a>
    {:else}
      <div class="flex flex-col">
        <span class="font-mono">{@html placeholderUrl}</span>
        <small>
          Example:
          <a href="#" on:click|preventDefault={populateWithExample}>
            {`https://github.com/${example.org}/${example.repo}/compare/${example.base}...${example.head}`}
          </a>
        </small>
      </div>
    {/if}
  </section>

  <Error {error} />

  <section>
    {#await data}
      loading...
    {:then data}
      {#if data?.files?.length}
        <div class="bg-white space-y-8">
          <div class="bg-gray-200 p-2 rounded">
            <label class="inline-flex items-center space-x-2">
              <input type="checkbox" bind:checked={highlight} />
              <span>highlight</span>
            </label>
          </div>

          <div class="space-x-2">
            <span>
              <strong>{data.files.length}</strong>
              files changed
            </span>

            <a
              href="#"
              on:click|preventDefault={() => (isCollapsedAll = !isCollapsedAll)}
              class="text-gray-600 hover:text-black text-xs font-bold"
            >
              {isCollapsedAll ? "expand" : "collapse"} all
            </a>
          </div>

          {#each data.files as file}
            <File {file} {highlight} {isCollapsedAll} />
          {/each}
        </div>
      {/if}
    {:catch error}
      <Error {error} />
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
</style>
