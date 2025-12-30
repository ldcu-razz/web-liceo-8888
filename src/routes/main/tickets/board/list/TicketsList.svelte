<script lang="ts" module>
	import { Button } from "$lib/components/ui/button";
	import type { Ticket } from "$lib/models/tickets/tickets.type";
	import { ChevronDownIcon } from "@lucide/svelte";
	import TicketsListItem from "./TicketsListItem.svelte";

  type Props = {
    tickets: Ticket[];
    onTicketClick?: ( ticket: Ticket ) => void;
  }
</script>

<script lang="ts">
  let { tickets, onTicketClick }: Props = $props();
</script>

<div class="flex flex-col gap-2">
  {#each tickets as ticket (ticket.id)}
    <TicketsListItem ticket={ticket} onClick={onTicketClick} />
  {/each}
  <div class="flex justify-center">
    <Button variant="ghost" size="sm">
      <ChevronDownIcon class="size-4" />
      Show more
    </Button>
  </div>
</div>