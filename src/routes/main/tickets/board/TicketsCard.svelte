<script lang="ts" module>
  import type { GetTicket } from "$lib/models/tickets/tickets.type";
  import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
  import { AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";
  import { TagIcon } from "@lucide/svelte";
  import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
  import { departmentsStore } from "$lib/store/departments.store";
  import { allUsersStore } from "$lib/store/users.store";
  import { Tooltip, TooltipContent } from "$lib/components/ui/tooltip";
  import TooltipTrigger from "$lib/components/ui/tooltip/tooltip-trigger.svelte";
  
  export type Props = {
    ticket: GetTicket;
    onClick?: ( ticket: GetTicket ) => void;
  }
</script>

<script lang="ts">
  let { ticket, onClick }: Props = $props();

  let departments = $derived($departmentsStore);

  let users = $derived($allUsersStore);

  let assignedDepartment = $derived(departments?.find(department => department.id === ticket.current_department_assigned?.id));

  let departmentInitial = $derived(assignedDepartment ? assignedDepartment?.name.slice(0, 2).toUpperCase() : 'AD');

  let assignedUser = $derived(users?.find(user => user.id === ticket.current_user_assigned?.id));

  let assignedUserInitial = $derived(assignedUser ? assignedUser?.firstname.slice(0, 1).toUpperCase() + assignedUser?.lastname.slice(0, 1).toUpperCase() : 'AU');

  let assignedUserAvatar = $derived(assignedUser?.avatar ?? DEFAULT_AVATAR);

  function handleClick() {
    onClick?.(ticket);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(ticket);
    }
  }
</script>

<div 
  class="flex flex-col gap-1 border border-gray-200 rounded-xs p-2.5 bg-white hover:shadow-xs hover:bg-slate-50 cursor-pointer" 
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={handleKeyDown}
>
  <div class="flex justify-between items-center gap-2">
    <div class="flex items-center gap-2">
      <div class="size-3 rounded-full">
        <TagIcon class="size-3 text-gray-500" />
      </div>
      <span class="text-xs font-semibold text-ellipsis line-clamp-1">{ticket.code}</span>
    </div>

    <div class="flex items-center gap-0.5">
      {#if assignedDepartment}
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Avatar class="size-5">
              <AvatarImage src={assignedDepartment?.avatar} />
              <AvatarFallback class="text-[8px]">{departmentInitial}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} hideArrow={true}>
            <span class="text-xs">{assignedDepartment?.name}</span>
          </TooltipContent>
        </Tooltip>
      {/if}

      {#if assignedUser}
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Avatar class="size-5">
              <AvatarImage src={assignedUserAvatar} />
              <AvatarFallback class="text-[8px]">{assignedUserInitial}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} hideArrow={true}>
            <span class="text-xs">{`${assignedUser?.firstname} ${assignedUser?.lastname}`}</span>
          </TooltipContent>
        </Tooltip>
      {/if}
    </div>
  </div>

  <div class="flex items-center justify-between gap-2">
    <span class="text-sm text-ellipsis line-clamp-1">{ticket.title}</span>
    <PriorityIcons priority={ticket.priority} />
  </div>
</div>