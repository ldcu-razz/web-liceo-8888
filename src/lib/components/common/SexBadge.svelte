<script lang="ts">
	import type { SexEnum } from "$lib/models/common/common.type";
	import { MarsIcon, VenusIcon } from "@lucide/svelte";

  type Props = {
    sex: SexEnum;
  };

  let { sex }: Props = $props();
</script>

<div
  class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
  class:text-blue-500!={sex === "male"}
  class:text-pink-500!={sex === "female"}
>
  {#if sex === "male"}
    <MarsIcon class="size-3 text-blue-500" />
  {:else if sex === "female"}
    <VenusIcon class="size-3 text-pink-500" />
  {/if}
  <span class="capitalize">{sex}</span>
</div>