<script lang="ts">
	import { TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import { ListIcon, PresentationIcon } from "@lucide/svelte";
	import ComplaintsBoard from "./kanban-board/ComplaintsBoard.svelte";
	import type { Complaints } from "$lib/models/complaints/complaints.type";

  let activeTab = $state("board");

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
      status: "backlog",
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
      status: "backlog",
      curent_department_assigned: "1",
      current_user_assigned: "1",
      created_by: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
</script>

<div class="flex flex-col gap-4 mx-auto h-full flex-1 min-h-0 w-full max-w-full">
  <h5 class="text-lg font-semibold">Complaints Board</h5>
  <div class="flex justify-between items-center gap-4 flex-1 flex-col min-h-0 w-full max-w-full">
    <Tabs value={activeTab} class="flex-1 flex flex-col min-h-0 w-full max-w-full">
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
      <TabsContent value="board" class="h-full flex-1 flex flex-col min-h-0 min-w-0 max-w-full">
        <div class="w-full max-w-full min-w-0 flex-1 min-h-0 overflow-x-auto overflow-auto">
          <ComplaintsBoard complaints={complaints} class="flex-1 min-h-0" />
        </div>
      </TabsContent>
      <TabsContent value="list" class="h-full flex-1 flex flex-col min-h-0 container">
        <h1 class="text-2xl font-semibold">Complaints List</h1>
      </TabsContent>
    </Tabs>
  </div>
</div>