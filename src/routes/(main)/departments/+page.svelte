<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { PlusIcon, SearchIcon } from "@lucide/svelte";
	import DeaprtmentsDataTable from "./DeaprtmentsDataTable.svelte";
	import { columns } from "./columns";
	import type { Departments } from "$lib/models/departments/departments.type";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";

  let data: Departments[] = $state([
    {
      id: "1",
      name: "Department 1",
      abbv: "D1",
      description: "Description 1",
      keywords: ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5", "Keyword 6", "Keyword 7", "Keyword 8", "Keyword 9", "Keyword 10"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Department 2",
      abbv: "D2",
      description: "Description 2",
      keywords: ["Keyword 3", "Keyword 4"],
      status: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Department 3",
      abbv: "D3",
      description: "Description 3",
      keywords: ["Keyword 5", "Keyword 6"],
      status: "archived",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  let search = $state("");
</script>

<div class="flex flex-col gap-4 container mx-auto">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-semibold">Departments</h1>
      <InputGroup>
        <InputGroupInput bind:value={search} placeholder="Search by name, abbv." />
        <InputGroupAddon>
          <SearchIcon class="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
    <Button variant="secondary">
      <PlusIcon class="size-4" />
      Add Department
    </Button>
  </div>
  
  <DeaprtmentsDataTable {columns} {data} />
</div>