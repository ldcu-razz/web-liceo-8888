<script lang="ts" module>
	import TicketStatusBadge from "$lib/components/common/TicketStatusBadge.svelte";
	import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { ItemContent } from "$lib/components/ui/item";
	import Item from "$lib/components/ui/item/item.svelte";
  import type { Ticket } from "$lib/models/tickets/tickets.type";
	import { TagIcon } from "@lucide/svelte";

  type Props = {
    ticket: Ticket;
    onClick?: ( ticket: Ticket ) => void;
  }
</script>

<script lang="ts">
  let { ticket, onClick }: Props = $props();

  function handleClick() {
    onClick?.(ticket);
  }
</script>

<div class="complaint-list-item cursor-pointer">
  <Item variant="outline" class="p-3 hover:bg-slate-50" onclick={handleClick}>
    <ItemContent>
      <div class="flex justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full">
            <TagIcon class="size-4 text-gray-500" />
          </div>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{ticket.code}</span>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{ticket.subject}</span>
        </div>

        <div class="flex items-center gap-2">
          <TicketStatusBadge status={ticket.status} size="sm" />
          <PriorityIcons priority={ticket.priority} />
          <Avatar class="size-5">
            <AvatarImage src={ticket.imageUrl} />
            <AvatarFallback>{ticket.current_user_assigned?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </ItemContent>
  </Item>
</div>