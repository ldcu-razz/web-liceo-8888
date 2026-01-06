<script lang="ts" module>
	import TicketStatusBadge from "$lib/components/common/TicketStatusBadge.svelte";
	import { Button } from "$lib/components/ui/button";
  import type { GetTicket, TicketsPriorities, TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { HistoryIcon, Share2Icon, TablePropertiesIcon, TagIcon, TrashIcon, XIcon } from "@lucide/svelte";
	import TicketDetailItem from "./TicketsDetaiItem.svelte";
	import AssignedDepartmentBadge from "$lib/components/common/AssignedDepartmentBadge.svelte";
	import AssignedUserBadge from "$lib/components/common/AssignedUserBadge.svelte";
	import { ticketsActions } from "$lib/store/tickets.store";
	import TicketPriorityBadge from "$lib/components/common/TicketPriorityBadge.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import TicketHistory from "$lib/components/common/TicketHistory.svelte";
  import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";
	import { ticketCommentsActions } from "$lib/store/ticket-comments.store";
	import { onMount } from "svelte";
	import TicketCommentSection from "./TicketCommentSection.svelte";
	import RichTextEditor from "$lib/components/common/RichTextEditor.svelte";
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "$lib/components/ui/tooltip";

  export type Props = {
    ticket: GetTicket;
    disabledDeleteTicketButton?: boolean;
    hideCloseButton?: boolean;
    hideShareButton?: boolean;
    close: () => void;
  }

  const propertiesTab = 'propertiesTab';
  const historyTab = 'historyTab';
</script>

<script lang="ts">
  let { ticket, disabledDeleteTicketButton = false, hideCloseButton = false, hideShareButton = false, close }: Props = $props();

  let activeTab = $state(propertiesTab);

  let showDeleteTicketModal = $state(false);

  let isEditDescription = $state(false);

  let descriptionValue = $state("");

  onMount(() => {
    ticketCommentsActions.getTicketComments(ticket.id);
  });

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

  function handleOpenDeleteTicketModal() {
    showDeleteTicketModal = true;
  }

  function handleDeleteTicket() {
    ticketsActions.deleteTicket(ticket.id);
    close();
  }

  function handleEditDescription() {
    isEditDescription = true;
    descriptionValue = ticket.description;
  }

  function handleDescriptionKeydown(event: KeyboardEvent) {
    if (isEditDescription) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEditDescription();
    }
  }

  function handleSaveEditDescription() {
    ticketsActions.updateTicketDescription(ticket.id, descriptionValue);
    isEditDescription = false;
    descriptionValue = "";
  }

  function handleCopyTicketLink() {
    ticketsActions.copyTicketLink(ticket.id);
  }
</script>

<section class="flex flex-col min-h-0 max-h-[80vh]">
  <header class="flex justify-between shrink-0">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2 mb-4">
        <TagIcon class="size-4 text-gray-500" />
        <h1 class="text-sm font-semibold">{ticket.code}</h1>
      </div>
      <div class="flex flex-col gap-0.5">
        <h2 class="text-lg font-semibold">{ticket.title}</h2>
        {#if ticket.category}
          <div class="border border-gray-300 rounded-sm p-1 w-fit">
            <div class="text-[10px] font-semibold">{ticket.category?.name}</div>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex gap-1 h-fit">
      {#if !disabledDeleteTicketButton}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon-sm" onclick={handleOpenDeleteTicketModal}>
              <TrashIcon class="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} hideArrow={true}>
            Delete Ticket
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/if}
      {#if !hideShareButton}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon-sm" onclick={handleCopyTicketLink}>
              <Share2Icon class="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} hideArrow={true}>
            Copy Ticket Link
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/if}
      {#if !hideCloseButton}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon-sm" onclick={close}>
                <XIcon class="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} hideArrow={true}>
              Close Ticket
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      {/if}
    </div>
  </header>

  <section class="grid grid-cols-10 gap-4 mt-4 flex-1 max-h-full overflow-hidden">
    <div class="flex flex-col col-span-6 pr-3 overflow-y-auto">
      <h3 class="text-sm font-semibold shrink-0 mb-2">Description</h3>
      {#if isEditDescription}
        <RichTextEditor bind:value={descriptionValue} placeholder="Edit description" hideAvatar={true} />
        <div class="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onclick={() => isEditDescription = false}>Cancel</Button>
          <Button variant="secondary" size="sm" onclick={handleSaveEditDescription}>Save</Button>
        </div>
      {:else}
        <div class="mb-4 min-h-32 shrink-0 hover:bg-gray-100 rounded-sm p-1 cursor-pointer" role="button" tabindex="0" onclick={handleEditDescription} onkeydown={handleDescriptionKeydown}>
          <p class="text-sm whitespace-pre-line">{@html ticket.description}</p>
        </div>
      {/if}

      <div class="mt-auto pt-8 flex-1 min-h-0">
        <TicketCommentSection ticketId={ticket.id} />
      </div>
    </div>

    <div class="col-span-4 flex flex-col gap-2 overflow-hidden">
      <div class="flex flex-col flex-1 border border-gray-200 rounded-sm p-4 overflow-y-auto">
        <div class="mb-6">
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="sm" aria-label="Go Back" class={activeTab === propertiesTab ? 'bg-gray-100' : ''} onclick={() => activeTab = propertiesTab}>
                <TablePropertiesIcon class="size-3" />
                <span class="text-xs">Properties</span>
              </Button>
              <Button variant="outline" size="sm" aria-label="Go Back" class={activeTab === historyTab ? 'bg-gray-100' : ''} onclick={() => activeTab = historyTab}>
                <HistoryIcon class="size-3" />
                <span class="text-xs">History</span>
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </div>
        {#if activeTab === propertiesTab}
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
        {/if}

        {#if activeTab === historyTab}
          <div class="max-h-[calc(80vh-230px)] overflow-y-auto">
            <TicketHistory ticketId={ticket.id} />
          </div>
        {/if}
      </div>
    </div>
  </section>
</section>

<AlertDialog bind:open={showDeleteTicketModal}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
      <AlertDialogDescription>Are you sure you want to delete this ticket?</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleDeleteTicket}>Yes, delete</Button>
      <Button variant="outline" onclick={() => showDeleteTicketModal = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>