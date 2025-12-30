<script lang="ts" module>
	import TicketStatusBadge from "$lib/components/common/TicketStatusBadge.svelte";
	import { Button } from "$lib/components/ui/button";
  import type { GetTicket, Ticket, TicketsPriorities, TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { Share2Icon, TagIcon, XIcon } from "@lucide/svelte";
	import TicketDetailItem from "./TicketsDetaiItem.svelte";
	import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
	import { transformText } from "$lib/utils/texts.utils";
	import AssignedDepartmentBadge from "$lib/components/common/AssignedDepartmentBadge.svelte";
	import AssignedUserBadge from "$lib/components/common/AssignedUserBadge.svelte";
	import CreateCommentField from "$lib/components/common/CreateCommentField.svelte";
	import { ticketsActions } from "$lib/store/tickets.store";
	import TicketPriorityBadge from "$lib/components/common/TicketPriorityBadge.svelte";

  export type Props = {
    ticket: GetTicket;
    close: () => void;
  }
</script>

<script lang="ts">
  let { ticket, close }: Props = $props();

  let commentValue = $state('');

  function handleStatusChangeTicketStatus(status: TicketStatuses) {
    ticketsActions.changeTicketStatus(ticket.id, status);
  }

  function handleDepartmentChangeAssignedDepartment(departmentId: string) {
    ticketsActions.changeAssignedDepartment(ticket.id, departmentId);
  }

  function handleUserChangeAssignedUser(userId: string) {
    ticketsActions.changeAssignedUser(ticket.id, userId);
  }

  function handlePriorityChangeTicketPriority(priority: TicketsPriorities) {
    ticketsActions.changeTicketPriority(ticket.id, priority);
  }
</script>

<section>
  <header class="flex justify-between">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2 mb-4">
        <TagIcon class="size-4 text-gray-500" />
        <h1 class="text-sm font-semibold">{ticket.code}</h1>
      </div>
      <h2 class="text-lg font-semibold">{ticket.title}</h2>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" size="icon-sm">
        <Share2Icon class="size-3" />
      </Button>
      <Button variant="outline" size="icon-sm" onclick={close}>
        <XIcon class="size-3" />
      </Button>
    </div>
  </header>

  <section class="grid grid-cols-10 gap-4 mt-4">
    <div class="flex flex-col col-span-6">
      <h3 class="text-sm font-semibold">Description</h3>
      <div class="min-h-46 mb-4">
        <p class="text-sm text-gray-500">{@html ticket.description}</p>
      </div>

      <CreateCommentField bind:value={commentValue} />
    </div>

    <div class="col-span-4 flex flex-col gap-2">
      <div class="flex flex-col flex-1 border border-gray-200 rounded-xs p-4">
        <h3 class="text-sm font-semibold mb-2">Properties</h3>
        <div class="flex flex-col gap-3">
          <TicketDetailItem title="Status">
            <TicketStatusBadge selectedStatus={ticket.status} size="sm" onStatusChange={handleStatusChangeTicketStatus} />
          </TicketDetailItem>

          <TicketDetailItem title="Department Assigned">
            <AssignedDepartmentBadge selectedDepartmentId={ticket.current_department_assigned?.id ?? ''} onDepartmentChange={handleDepartmentChangeAssignedDepartment} />
          </TicketDetailItem>

          <TicketDetailItem title="Assigned to">
            <AssignedUserBadge selectedUserId={ticket.current_user_assigned?.id ?? ''} onUserChange={handleUserChangeAssignedUser} />
          </TicketDetailItem>

          <TicketDetailItem title="Reported by">
            <AssignedUserBadge selectedUserId={ticket.reported_by?.id ?? ''} showOptions={false} />
          </TicketDetailItem>

          <TicketDetailItem title="Priority">
            <TicketPriorityBadge selectedPriority={ticket.priority} onPriorityChange={handlePriorityChangeTicketPriority} />
          </TicketDetailItem>

          <TicketDetailItem title="Created At">
            <div class="flex items-center gap-1 border border-gray-200 rounded-sm px-2.5 py-1">
              <span class="text-xs">{new Date(ticket.createdAt).toLocaleString('en-US', {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).replace(', ', ' ').replace(/\s(AM|PM)/, '$1')}</span>
            </div>
          </TicketDetailItem>

          <TicketDetailItem title="Updated At">
            <div class="flex items-center gap-1 border border-gray-200 rounded-sm px-2.5 py-1">
              <span class="text-xs">{new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).replace(', ', ' ').replace(/\s(AM|PM)/, '$1')}</span>
            </div>
          </TicketDetailItem>
        </div>
      </div>
    </div>
  </section>
</section>