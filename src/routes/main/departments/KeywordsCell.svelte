<script lang="ts">
  let { keywords }: { keywords: string[] } = $props();
</script>

{#if !keywords || keywords.length === 0}
  No keywords
{:else if keywords.length > 3}
  <span>
    {keywords.slice(0, 3).join(", ")} <span class="border border-gray-300 bg-gray-50 rounded-md ml-1 px-1 py-0.5 text-xs">+{keywords.length - 3}</span>
  </span>
{:else}
  {keywords.join(", ")}
{/if}

