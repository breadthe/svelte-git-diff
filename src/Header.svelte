<script>
  import GitHubIcon from "./icons/GitHubIcon.svelte";
  import TwitterIcon from "./icons/TwitterIcon.svelte";

  export let title;
  export let subtitle;
</script>

<section class="flex items-center justify-between">
  <div>
    <h1>
      <a href="/" class="flex items-center space-x-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 1081 1081"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="28"
            y="28"
            width="1025"
            height="1025"
            rx="82"
            fill="white"
            stroke="black"
            stroke-width="56"
          />
          <circle cx="207" cy="201" r="59" stroke="black" stroke-width="66" />
          <path
            d="M207 263L207 779.343C207 897.179 272.265 871.672 441 871.672"
            stroke="black"
            stroke-width="66"
          />
          <path
            d="M385.054 790.466L370.054 781.806L370.054 799.127L370.054 945.476L370.054 962.796L385.054 954.136L511.796 880.962L526.796 872.301L511.796 863.641L385.054 790.466Z"
            fill="black"
            stroke="black"
            stroke-width="20"
          />
          <circle
            cx="875"
            cy="870.603"
            r="59"
            transform="rotate(180 875 870.603)"
            stroke="black"
            stroke-width="66"
          />
          <path
            d="M875 808.603L875 292.26C875 174.424 809.735 199.931 641 199.931"
            stroke="black"
            stroke-width="66"
          />
          <path
            d="M696.946 281.136L711.946 289.796L711.946 272.476L711.946 126.127L711.946 108.806L696.946 117.466L570.204 190.641L555.204 199.301L570.204 207.962L696.946 281.136Z"
            fill="black"
            stroke="black"
            stroke-width="20"
          />
          <circle
            cx="644"
            cy="645"
            r="32"
            transform="rotate(180 644 645)"
            fill="black"
            stroke="black"
            stroke-width="56"
          />
          <circle
            cx="541"
            cy="540"
            r="32"
            fill="black"
            stroke="black"
            stroke-width="56"
          />
          <circle
            cx="438"
            cy="435"
            r="32"
            fill="black"
            stroke="black"
            stroke-width="56"
          />
        </svg>
        <span>{title}</span>
      </a>
    </h1>
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
