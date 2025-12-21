<script lang="ts">
  import type { BaseStatusEnum } from "$lib/models/common/common.type";
  import { CircleCheck, Sparkles, Archive } from "@lucide/svelte";

  let { status }: { status: BaseStatusEnum } = $props();
</script>

<div class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
  {#if status === "active"}
    <CircleCheck class="size-3 text-green-500" />
  {:else if status === "inactive"}
    <Sparkles class="h-3 w-3 text-gray-500" />
  {:else if status === "archived"}
    <Archive class="size-3 text-red-500" />
  {/if}
  <span class="capitalize">{status}</span>
</div>