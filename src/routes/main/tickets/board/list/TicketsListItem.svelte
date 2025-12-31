<script lang="ts" module>
	import TicketStatusBadge from "$lib/components/common/TicketStatusBadge.svelte";
	import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { ItemContent } from "$lib/components/ui/item";
	import Item from "$lib/components/ui/item/item.svelte";
  import type { GetTicket, TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { TagIcon } from "@lucide/svelte";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { allUsersStore } from "$lib/store/users.store";
	import { departmentsStore } from "$lib/store/departments.store";
	import { Tooltip, TooltipContent, TooltipTrigger } from "$lib/components/ui/tooltip";
	import { ticketsActions } from "$lib/store/tickets.store";

  type Props = {
    ticket: GetTicket;
    onClick?: ( ticket: GetTicket ) => void;
  }
</script>

<script lang="ts">
  let { ticket, onClick }: Props = $props();

  let users = $derived($allUsersStore);

  let departments = $derived($departmentsStore);

  let assignedDepartment = $derived(departments?.find(department => department.id === ticket.current_department_assigned?.id));

  let assignedDepartmentInitial = $derived(assignedDepartment ? assignedDepartment?.name.slice(0, 2).toUpperCase() : 'AD');

  let assignedUser = $derived(users?.find(user => user.id === ticket.current_user_assigned?.id));

  let assignedUserInitial = $derived(assignedUser ? assignedUser?.firstname.slice(0, 1).toUpperCase() + assignedUser?.lastname.slice(0, 1).toUpperCase() : 'AU');

  let assignedUserAvatar = $derived(assignedUser?.avatar ?? DEFAULT_AVATAR);

  function handleClick() {
    onClick?.(ticket);
  }

  function handleStatusChangeTicketStatus(status: TicketStatuses) {
    ticketsActions.changeTicketStatus(ticket.id, status);
  }
</script>

<div class="complaint-list-item cursor-pointer">
  <Item variant="outline" class="px-3 py-2 hover:bg-slate-50" onclick={handleClick}>
    <ItemContent>
      <div class="flex justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full">
            <TagIcon class="size-4 text-gray-500" />
          </div>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{ticket.code}</span>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{ticket.title}</span>
        </div>

        <div class="flex items-center gap-2">
          <TicketStatusBadge selectedStatus={ticket.status} size="sm" onStatusChange={handleStatusChangeTicketStatus} />
          <PriorityIcons priority={ticket.priority} />
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Avatar class="size-6">
                <AvatarImage src={assignedUser ? assignedUserAvatar: assignedDepartment?.avatar} />
                <AvatarFallback class="text-xs">{assignedUser ? assignedUserInitial : assignedDepartmentInitial}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={4} hideArrow={true}>
              <span class="text-xs">{assignedUser ? assignedUser.firstname + ' ' + assignedUser.lastname : assignedDepartment?.name}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </ItemContent>
  </Item>
</div>