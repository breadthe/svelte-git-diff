<script>
  import GitHubIcon from "./icons/GitHubIcon.svelte";
  import TwitterIcon from "./icons/TwitterIcon.svelte";

  export let title;
  export let subtitle;
</script>

<section class="flex items-center justify-between">
  <div>
    <h1 class=""><a href="/">{title}</a></h1>
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

<style>
  h1 {
    @apply text-3xl font-bold;
  }

  input {
    @apply border border-gray-600 rounded px-2 py-1;
  }
</style>
