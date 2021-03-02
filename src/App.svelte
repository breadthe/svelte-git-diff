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

  let org, repo, from, to; // Example: laravel laravel 8.x master
  const example = {
    org: "laravel",
    repo: "laravel",
    from: "8.x",
    to: "master",
  };

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
  $: placeholderUrl = `https://github.com/
    <span class="highlight">${org?.length ? org : "&lt;org&gt;"}</span>/
    <span class="highlight">${
      repo?.length ? repo : "&lt;repo&gt;"
    }</span>/compare/
    <span class="highlight">${from?.length ? from : "&lt;to&gt;"}</span>...
    <span class="highlight">${
      to?.length ? to : "&lt;from&gt;"
    }</span>`.replaceAll(/\s{2,5}/g, "");

  let data = {};
  let error = "";

  let highlight = false;

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
    window.location.hash = `org=${org}&repo=${repo}&from=${from}&to=${to}`;
  }

  // Example: http://localhost:5000/#org=laravel&repo=laravel&from=8.x&to=master
  async function getUrlHashAction(node, params) {
    hash = window.location.hash.substr(1); // org=laravel&repo=laravel&from=8.x&to=master
    const hashObj = Object.fromEntries(
      hash.split("&").map((i) => i.split("="))
    ); // {org: "laravel", repo: "laravel", from: "7.x", to: "8.x"}
    if (hashObj?.org?.length) org = hashObj.org;
    if (hashObj?.repo?.length) repo = hashObj.repo;
    if (hashObj?.from?.length) from = hashObj.from;
    if (hashObj?.to?.length) to = hashObj.to;

    await tick();

    getDiff();
  }

  function populateWithExample() {
    ({ org, repo, from, to } = { ...example });
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
            {`https://github.com/${example.org}/${example.repo}/compare/${example.from}...${example.to}`}
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
            <File {file} {highlight} />
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
