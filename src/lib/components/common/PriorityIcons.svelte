<script lang="ts" module>
  import type { ComplaintPriorities } from "$lib/models/complaints/complaints.type";
</script>

<script lang="ts">
  import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, EqualIcon } from "@lucide/svelte";
	import Tooltip from "../ui/tooltip/tooltip.svelte";
	import { TooltipProvider, TooltipTrigger } from "../ui/tooltip";
	import TooltipContent from "../ui/tooltip/tooltip-content.svelte";
	import { transformText } from "$lib/utils/texts.utils";

  let { priority }: { priority: ComplaintPriorities } = $props();
</script>

<TooltipProvider delayDuration={0}>
  <Tooltip>
    <TooltipTrigger>
      <div class="flex items-center gap-2">
        {#if priority === "low"}
          <ChevronDown class="size-5 text-cyan-500" />
        {:else if priority === "lowest"}
          <ChevronsDown class="size-5 text-blue-500" />
        {:else if priority === "medium"}
          <EqualIcon class="size-5 text-gray-500" />
        {:else if priority === "high"}
          <ChevronUp class="size-5 text-amber-500" />
        {:else if priority === "highest"}
          <ChevronsUp class="size-6 text-red-500" />
        {/if}
      </div>
    </TooltipTrigger>
    <TooltipContent sideOffset={4} hideArrow={true}>
      {transformText(priority)}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>