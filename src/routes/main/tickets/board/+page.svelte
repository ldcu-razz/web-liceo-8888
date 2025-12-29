<script lang="ts">
	import { TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import { ListIcon, PresentationIcon } from "@lucide/svelte";
	import ComplaintsBoard from "./kanban-board/TicketsBoard.svelte";
	import type { Ticket } from "$lib/models/tickets/tickets.type";
	import ComplaintsList from "./list/TicketsList.svelte";
	import ComplainFilters from "./TicketsFilters.svelte";
	import Dialog from "$lib/components/ui/dialog/dialog.svelte";
	import { DialogContent } from "$lib/components/ui/dialog";
	import ComplainDetails from "./TicketsDetails.svelte";

  let activeTab = $state("board");
  let showTicketDetails = $state(false);
  let selectedTicket = $state<Ticket | null>(null);

  let tickets = $state<Ticket[]>([
    {
      id: "1",
      category: "1",
      code: "1",
      subject: "Subject 1",
      description: "Description 1",
      imageUrl: "https://via.placeholder.com/150",
      priority: "low",
      status: "backlog",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      category: "2",
      code: "2",
      subject: "Subject 2",
      description: "Description 2",
      imageUrl: "https://via.placeholder.com/150",
      priority: "medium",
      status: "ready",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      category: "3",
      code: "3",
      subject: "Subject 3",
      description: "Description 3",
      imageUrl: "https://via.placeholder.com/150",
      priority: "high",
      status: "in_progress",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      category: "4",
      code: "4",
      subject: "Subject 4",
      description: "Description 4",
      imageUrl: "https://via.placeholder.com/150",
      priority: "highest",
      status: "in_review",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      category: "5",
      code: "5",
      subject: "Subject 5",
      description: "Description 5",
      imageUrl: "https://via.placeholder.com/150",
      priority: "lowest",
      status: "done",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "6",
      category: "6",
      code: "6",
      subject: "Subject 6",
      description: "Description 6",
      imageUrl: "https://via.placeholder.com/150",
      priority: "lowest",
      status: "archived",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  function handleTicketClick(ticket: Ticket) {
    selectedTicket = ticket;
    showTicketDetails = true;
  }
</script>

<div class="flex flex-col gap-4 mx-auto h-full flex-1 min-h-0 w-full max-w-full">
  <h5 class="text-xl font-semibold">Tickets {activeTab === "board" ? "Board" : "List"}</h5>
  <div class="flex justify-between items-center gap-4">
    <ComplainFilters />
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

  <div class="h-full flex-1 flex flex-col min-h-0 min-w-0 max-w-full">
    {#if activeTab === "board"}
      <ComplaintsBoard tickets={tickets} class="flex-1 min-h-0" onTicketClick={handleTicketClick} />
    {:else}
      <ComplaintsList tickets={tickets} onTicketClick={handleTicketClick} />
    {/if}
  </div>
</div>

<Dialog bind:open={showTicketDetails}>
  <DialogContent showCloseButton={false} class="sm:max-w-6xl">
    {#if selectedTicket}
      <ComplainDetails ticket={selectedTicket} close={() => showTicketDetails = false} />
    {/if}
  </DialogContent>
</Dialog>