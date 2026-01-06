<script lang="ts" module>
  import type { TicketsPriorities } from "$lib/models/tickets/tickets.type";
  import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, EqualIcon } from "@lucide/svelte";
  import Tooltip from "../ui/tooltip/tooltip.svelte";
  import { TooltipProvider, TooltipTrigger } from "../ui/tooltip";
  import TooltipContent from "../ui/tooltip/tooltip-content.svelte";
  import { transformText } from "$lib/utils/texts.utils";

  export type Props = {
    priority: TicketsPriorities;
    showTooltip?: boolean;
  }
</script>

<script lang="ts">
  let { priority, showTooltip = true }: Props = $props();
</script>

{#snippet content()}
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
      <ChevronsUp class="size-5 text-red-500" />
    {/if}
  </div>
{/snippet}

{#if showTooltip}
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger>
        {@render content()}
      </TooltipTrigger>
      <TooltipContent sideOffset={4} hideArrow={true}>
        {transformText(priority)}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
{:else}
  {@render content()}
{/if}