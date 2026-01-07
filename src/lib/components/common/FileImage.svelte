<script lang="ts" module>
  export type Props = {
    storagePath: string;
    alt?: string;
    class?: string;
  };
</script>

<script lang="ts">
  import { getSignedUrl } from "$lib/services/files/files.service";
  import { onMount } from "svelte";

  let { storagePath, alt = "", class: className = "" }: Props = $props();
  
  let signedUrl = $state<string>("");
  let loading = $state(true);
  let error = $state(false);

  onMount(async () => {
    try {
      signedUrl = await getSignedUrl(storagePath);
      loading = false;
    } catch (err) {
      console.error("Failed to load image:", err);
      error = true;
      loading = false;
    }
  });
</script>

{#if loading}
  <div class={`bg-gray-200 animate-pulse ${className}`}></div>
{:else if error}
  <div class={`bg-gray-300 flex items-center justify-center ${className}`}>
    <span class="text-xs text-gray-500">Failed to load</span>
  </div>
{:else}
  <img src={signedUrl} {alt} class={className} />
{/if}

