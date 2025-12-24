<script lang="ts">
	import { TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import { ListIcon, PresentationIcon } from "@lucide/svelte";
	import ComplaintsBoard from "./kanban-board/ComplaintsBoard.svelte";
	import type { Complaints } from "$lib/models/complaints/complaints.type";
	import ComplaintsList from "./list/ComplaintsList.svelte";
	import Select from "$lib/components/ui/select/select.svelte";
	import { SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import ComplainFilters from "./ComplainFilters.svelte";
	import Dialog from "$lib/components/ui/dialog/dialog.svelte";
	import { DialogContent } from "$lib/components/ui/dialog";
	import ComplainDetails from "./ComplainDetails.svelte";

  let activeTab = $state("board");
  let showComplaintDetails = $state(false);
  let selectedComplaint = $state<Complaints | null>(null);

  let complaints = $state<Complaints[]>([
    {
      id: "1",
      complaint_category: "1",
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
      complaint_category: "2",
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
      complaint_category: "3",
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
      complaint_category: "4",
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
      complaint_category: "5",
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
      complaint_category: "6",
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

  function handleComplainClick(complaint: Complaints) {
    selectedComplaint = complaint;
    showComplaintDetails = true;
  }
</script>

<div class="flex flex-col gap-4 mx-auto h-full flex-1 min-h-0 w-full max-w-full">
  <h5 class="text-xl font-semibold">Complaints {activeTab === "board" ? "Board" : "List"}</h5>
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
      <ComplaintsBoard complaints={complaints} class="flex-1 min-h-0" onComplainClick={handleComplainClick} />
    {:else}
      <ComplaintsList complaints={complaints} onComplainClick={handleComplainClick} />
    {/if}
  </div>
</div>

<Dialog bind:open={showComplaintDetails}>
  <DialogContent showCloseButton={false} class="sm:max-w-6xl">
    {#if selectedComplaint}
      <ComplainDetails complaint={selectedComplaint} close={() => showComplaintDetails = false} />
    {/if}
  </DialogContent>
</Dialog>