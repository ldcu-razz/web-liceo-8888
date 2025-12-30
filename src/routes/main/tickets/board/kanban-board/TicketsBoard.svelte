<script lang="ts" module>
	import { Badge } from "$lib/components/ui/badge";
	import { TicketStatusesSchema } from "$lib/models/tickets/tickets.schema";
	import type { Ticket, TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { transformText } from "$lib/utils/texts.utils";
	import TicketsCard from "../TicketsCard.svelte";

  type BoardColumnBase = {
    id: TicketStatuses;
    title: TicketStatuses;
    description: string;
    colorClass: string;
  };

  type BoardColumn = BoardColumnBase & {
    items: Ticket[];
  };

  type Props = {
    tickets: Ticket[];
    class: string;
    onTicketClick?: ( ticket: Ticket ) => void;
  }
</script>

<script lang="ts">
	import { draggable, droppable } from "$lib/utils/drag-drop.utils";
	import { SvelteMap } from "svelte/reactivity";

  let { tickets, class: className = "", onTicketClick }: Props = $props();

  let baseColumns = $state<BoardColumnBase[]>([
    {
      id: TicketStatusesSchema.enum.backlog,
      title: TicketStatusesSchema.enum.backlog,
      description: "This items are not yet started",
      colorClass: "bg-gray-500",
    },
    {
      id: TicketStatusesSchema.enum.ready,
      title: TicketStatusesSchema.enum.ready,
      description: "This items are ready to be started",
      colorClass: "bg-yellow-500",
    },
    {
      id: TicketStatusesSchema.enum.in_progress,
      title: TicketStatusesSchema.enum.in_progress,
      description: "This items are in progress",
      colorClass: "bg-blue-500",
    },
    {
      id: TicketStatusesSchema.enum.in_review,
      title: TicketStatusesSchema.enum.in_review,
      description: "This items are in review",
      colorClass: "bg-purple-500",
    },
    {
      id: TicketStatusesSchema.enum.done,
      title: TicketStatusesSchema.enum.done,
      description: "This items has been done",
      colorClass: "bg-green-500",
    },
  ]);

  // Track status overrides for complaints that have been moved
  let statusOverrides = new SvelteMap<string, TicketStatuses>();

  let columns = $derived<BoardColumn[]>(baseColumns.map((column) => ({
    ...column,
    items: tickets
      .filter((ticket) => {
        const currentStatus = statusOverrides.get(ticket.id) ?? ticket.status;
        return currentStatus === column.title;
      })
      .map(ticket => ({
        ...ticket,
        status: statusOverrides.get(ticket.id) ?? ticket.status
      })),
  })));

  // Handle drop event
  function handleDrop(draggedTicket: Ticket, targetColumnId: string) {
    // Update the status based on the target column
    const newStatus = targetColumnId as TicketStatuses;
    
    // Update the status override using SvelteMap
    statusOverrides.set(draggedTicket.id, newStatus);

    console.log(`✅ Moved ticket "${draggedTicket.subject}" from ${draggedTicket.status} to ${newStatus}`);

    // TODO: Here you would typically make an API call to persist the status change
    // Example:
    // await updateComplaintStatus(draggedComplaint.id, newStatus);
  }
</script>

<section
  class={["flex flex-1 w-full gap-2 h-full min-h-0", className]}
>
  {#each columns as column (column.id)}
    <div class="column flex-1 flex flex-col gap-2 border border-gray-200 rounded-xs h-full min-h-0 shrink-0 min-w-[200px] bg-gray-50">
      <div class="flex flex-col gap-1 bg-white border-b border-gray-200 pt-3 pb-2 px-2">
        <div class="flex items-center gap-2">
          <div class={column.colorClass + " size-3 rounded-full"}></div>
          <span class="text-sm font-medium">{transformText(column.title)}</span>
          <Badge variant="outline">{column.items.length}</Badge>
        </div>
        <p class="text-xs text-gray-500 px-2">{column.description}</p>
      </div>

      <div class="flex-1 min-h-0 px-1 pb-1">
        <div
          class="h-full rounded-sm flex flex-col gap-1 column-content drop-zone"
          use:droppable={{
            dropZoneId: column.id,
            onDrop: handleDrop
          }}
        >
          {#each column.items as ticket (ticket.id)}
            <div 
              class="card"
              use:draggable={{
                data: ticket
              }}
            >
              <TicketsCard ticket={ticket} onClick={onTicketClick} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</section>

<style>
  .card {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .card.dragging {
    opacity: 0.5;
  }

  .drop-zone {
    position: relative;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .drop-zone.drag-over {
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px dashed rgba(59, 130, 246, 0.5);
    border-radius: 0.375rem;
  }
</style>