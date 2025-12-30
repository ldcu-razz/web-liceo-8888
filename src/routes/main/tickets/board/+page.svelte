<script lang="ts">
	import { TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import { ListIcon, PlusIcon, PresentationIcon } from "@lucide/svelte";
	import TicketsBoard from "./kanban-board/TicketsBoard.svelte";
	import type { GetTicket, PostTicket } from "$lib/models/tickets/tickets.type";
	import TicketsList from "./list/TicketsList.svelte";
	import TicketsFilters from "./TicketsFilters.svelte";
	import Dialog from "$lib/components/ui/dialog/dialog.svelte";
	import { DialogContent, DialogTitle } from "$lib/components/ui/dialog";
	import { ticketsActions, ticketsLoading, ticketsStore, ticketsTotalCount } from "$lib/store/tickets.store";
	import { onMount } from "svelte";
	import TicketsDetails from "./TicketsDetails.svelte";
	import { Button } from "$lib/components/ui/button";
	import CreateTicketForm, { initialFormData, type FormData as CreateTicketFormData } from "../CreateTicketForm.svelte";
	import { uuid } from "$lib/utils/uuid.util";
	import { meStore } from "$lib/store/me.store";

  let tickets = $derived($ticketsStore);
  let loading = $derived($ticketsLoading);
  let totalCount = $derived($ticketsTotalCount);

  let showTicketDetails = $state(false);
  let selectedTicket = $state<GetTicket | null>(null);

  let showCreateTicketForm = $state(false);
  let createTicketFormData = $state<CreateTicketFormData>({ ...initialFormData });
  let createTicketFormLoading = $state(false);

  let activeTab = $state("board");

  let me = $derived($meStore);

  onMount(() => {
    ticketsActions.getTickets({ page: 1, size: 20 });
  });

  function handleTicketClick(ticket: GetTicket) {
    selectedTicket = ticket;
    showTicketDetails = true;
  }

  function toggleCreateTicketForm() {
    showCreateTicketForm = !showCreateTicketForm;
  }

  async function handleAddTicketClick(formData: CreateTicketFormData) {
    createTicketFormLoading = true;
    const payload: PostTicket = {
      ...formData,
      id: uuid(),
      category_id: formData.category_id,
      priority: (formData.priority as PostTicket['priority']) || "medium",
      reported_by: me?.id || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await ticketsActions.createTicket(payload);
  
    showCreateTicketForm = false;
    createTicketFormLoading = false;
  }
</script>

<div class="flex flex-col gap-4 mx-auto h-full flex-1 min-h-0 w-full max-w-full">
  <div class="flex items-center justify-between mb-2">
    <h5 class="text-xl font-semibold">Tickets {activeTab === "board" ? "Board" : "List"}</h5>
    <div class="flex items-center gap-2">
      <Button variant="secondary" onclick={toggleCreateTicketForm}>
        <PlusIcon class="size-4" />
        Create Ticket
      </Button>
    </div>
  </div>
  <div class="flex justify-between items-center gap-4">
    <TicketsFilters loading={loading} />
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500">{tickets.length}/{totalCount} tickets</span>
      <Tabs bind:value={activeTab} class="">
        <TabsList>
          <TabsTrigger value="board">
            <PresentationIcon class="size-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="list">
            <ListIcon class="size-4" />
            List
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </div>

  <div class="h-full flex-1 flex flex-col min-h-0 min-w-0 max-w-full">
    {#if activeTab === "board"}
      <TicketsBoard tickets={tickets} class="flex-1 min-h-0" onTicketClick={handleTicketClick} />
    {:else}
      <TicketsList tickets={tickets} onTicketClick={handleTicketClick} />
    {/if}
  </div>
</div>

<Dialog bind:open={showTicketDetails}>
  <DialogContent showCloseButton={false} class="sm:max-w-6xl">
    {#if selectedTicket}
      <TicketsDetails ticket={selectedTicket} close={() => showTicketDetails = false} />
    {/if}
  </DialogContent>
</Dialog>

<Dialog bind:open={showCreateTicketForm}>
  <DialogContent class="sm:max-w-2xl">
    <DialogTitle>Create Ticket</DialogTitle>
    <CreateTicketForm bind:formData={createTicketFormData} loading={createTicketFormLoading} onSubmit={handleAddTicketClick} onCancel={toggleCreateTicketForm} />
  </DialogContent>
</Dialog>