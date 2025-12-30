<script lang="ts" module>
	import { Button } from "$lib/components/ui/button";
	import type { GetTicket, Ticket } from "$lib/models/tickets/tickets.type";
	import { ChevronDownIcon } from "@lucide/svelte";
	import TicketsListItem from "./TicketsListItem.svelte";

  type Props = {
    tickets: GetTicket[];
    onTicketClick?: ( ticket: GetTicket ) => void;
  }
</script>

<script lang="ts">
  let { tickets, onTicketClick }: Props = $props();

  let emptyData = $derived(tickets.length === 0);
</script>

<div class="flex flex-col gap-2">
  {#if emptyData}
    <div class="flex flex-col justify-center items-center gap-2">
      <p class="text-sm text-gray-500">No tickets to show</p>
    </div>
  {:else}
    {#each tickets as ticket (ticket.id)}
      <TicketsListItem ticket={ticket} onClick={onTicketClick} />
    {/each}
  {/if}

  {#if !emptyData}
    <div class="flex justify-center">
      <Button variant="ghost" size="sm">
        <ChevronDownIcon class="size-4" />
        Show more
      </Button>
    </div>
  {/if}
</div>