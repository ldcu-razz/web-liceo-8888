<script lang="ts" module>
	import SelectWithSearch from "$lib/components/common/SelectWithSearch.svelte";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { TicketStatusesSchema } from "$lib/models/tickets/tickets.schema";
	import type { TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { transformText } from "$lib/utils/texts.utils";
	import { LoaderCircleIcon, SearchIcon, XIcon } from "@lucide/svelte";

  export type Props = {
    searchQuery?: string;
    selectedDepartments?: string[];
    selectedUsers?: string[];
    selectedStatus?: TicketStatuses | undefined;
    loading?: boolean;
    navigateToList?: () => void;
  }
</script>

<script lang="ts">
	import InputGroup from "$lib/components/ui/input-group/input-group.svelte";
	import { InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { departmentsMap, departmentsStore } from "$lib/store/departments.store";
	import { allUsersMap, allUsersStore } from "$lib/store/users.store";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Button } from "$lib/components/ui/button";

  let {
    searchQuery = $bindable(""),
    selectedDepartments = $bindable([]),
    selectedUsers = $bindable([]),
    selectedStatus = $bindable(undefined),
    loading = $bindable(false),
    navigateToList
  }: Props = $props();

  let openDepartmentsSelect = $state(false);
  let searchDepartmentsQuery = $state("");

  let searchUsersQuery = $state("");
  let openUsersSelect = $state(false);
  
  let statuses: { label: string, value: TicketStatuses | "" }[] = [
    ...TicketStatusesSchema.options.map((status) => ({
      label: transformText(status),
      value: status,
    }))
  ];

  let departments = $derived($departmentsStore.map(department => ({
    label: department.name,
    value: department.id,
  })));

  let filteredDepartments = $derived(departments.filter(department => department.label.toLowerCase().includes(searchDepartmentsQuery.toLowerCase())));

  let departmentsMapData = $derived($departmentsMap);

  let users = $derived($allUsersStore.map(user => ({
    label: `${user.firstname} ${user.lastname}`,
    value: user.id,
  })));

  let filteredUsers = $derived(users.filter(user => user.label.toLowerCase().includes(searchUsersQuery.toLowerCase())));

  let usersMapData = $derived($allUsersMap);

  function handleClearDepartmentsSearch() {
    selectedDepartments = [];
    openDepartmentsSelect = false;
  }

  function handleClearUsersSearch() {
    selectedUsers = [];
    openUsersSelect = false;
  }

  function handleStatusSelect(status: TicketStatuses) {
    selectedStatus = status;
    if (status === TicketStatusesSchema.enum.archived || status === TicketStatusesSchema.enum.closed) {
      navigateToList?.();
    }
  }

  function handleClearStatus() {
    selectedStatus = undefined;
  }
</script>

<div class="flex items-center gap-2">
  <InputGroup>
    <InputGroupInput bind:value={searchQuery} placeholder="Search by code, title" />
    <InputGroupAddon>
      <SearchIcon class="size-4" />
    </InputGroupAddon>
  </InputGroup>

  <Select type="multiple" bind:value={selectedDepartments} bind:open={openDepartmentsSelect}>
    <SelectTrigger class="min-w-48 max-w-48">
      <span class="text-ellipsis overflow-hidden whitespace-nowrap">
        {#if selectedDepartments.length === 0}
          Assigned Departments
        {:else if selectedDepartments.length === 1}
          {departmentsMapData[selectedDepartments[0]]?.name}
        {:else}
          {departmentsMapData[selectedDepartments[0]]?.name} +{selectedDepartments.length - 1}
        {/if}
      </span>
    </SelectTrigger>
    <SelectContent class="relative min-w-72">
      <div class="absolute top-0 left-0 w-full p-2 bg-white/50 z-10 flex items-center justify-between gap-1">
        <Input type="text" bind:value={searchDepartmentsQuery} placeholder="Search departments" />
        <Button variant="link" size="sm" class="text-red-500 text-xs py-1 rounded-none" onclick={handleClearDepartmentsSearch}>
          Clear
        </Button>
      </div>
      <div class="max-h-62 overflow-y-auto mt-12">
        {#if filteredDepartments.length > 0}
          {#each filteredDepartments as department (department.value)}
            <SelectItem value={department.value} class="flex items-center gap-2">
              <Avatar class="size-5 border border-gray-200">
                <AvatarImage src={department.value} />
                <AvatarFallback class="text-[10px]">{department.label.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span class="text-ellipsis text-xs overflow-hidden whitespace-nowrap">{department.label}</span>
            </SelectItem>
          {/each}
        {:else}
          <div class="text-center text-sm text-gray-500 p-2">
            <span>No departments found</span>
          </div>
        {/if}
      </div>
    </SelectContent>
  </Select>

  <Select type="multiple" bind:value={selectedUsers} bind:open={openUsersSelect}>
    <SelectTrigger class="min-w-42 max-w-42">
      <span class="text-ellipsis overflow-hidden whitespace-nowrap">
        {#if selectedUsers.length === 0}
          Assignees
        {:else if selectedUsers.length === 1}
          {usersMapData[selectedUsers[0]]?.firstname} {usersMapData[selectedUsers[0]]?.lastname}
        {:else}
          {usersMapData[selectedUsers[0]]?.firstname} {usersMapData[selectedUsers[0]]?.lastname} +{selectedUsers.length - 1}
        {/if}
      </span>
    </SelectTrigger>
    <SelectContent class="relative min-w-72">
      <div class="absolute top-0 left-0 w-full p-2 bg-white/50 z-10 flex items-center justify-between gap-1">
        <Input type="text" bind:value={searchUsersQuery} placeholder="Search users" />
        <Button variant="link" size="sm" class="text-red-500 text-xs py-1 rounded-none" onclick={handleClearUsersSearch}>
          Clear
        </Button>
      </div>
      <div class="max-h-62 overflow-y-auto mt-12">
        {#if filteredUsers.length > 0}
          {#each filteredUsers as user (user.value)}
            <SelectItem value={user.value} class="flex items-center gap-2">
              <Avatar class="size-5 border border-gray-200">
                <AvatarImage src={user.value} />
                <AvatarFallback class="text-[10px]">{user.label.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span class="text-ellipsis text-xs overflow-hidden whitespace-nowrap">{user.label}</span>
            </SelectItem>
          {/each}
        {:else}
          <div class="text-center text-sm text-gray-500 p-2">
            <span>No users found</span>
          </div>
        {/if}
      </div>
    </SelectContent>
  </Select>

  <Select type="single" bind:value={selectedStatus}>
    <SelectTrigger class="min-w-36">{selectedStatus ? transformText(selectedStatus) : "Status"}</SelectTrigger>
    <SelectContent class="min-w-40 relative">
      <div class="max-h-62 overflow-y-auto">
        {#each statuses as status (status.value)}
          <SelectItem value={status.value} class="text-xs" onclick={() => handleStatusSelect(status.value as TicketStatuses)}>{status.label}</SelectItem>
        {/each}
      </div>
      <Button variant="link" size="sm" class="w-full text-red-500 text-xs py-1 rounded-none" onclick={handleClearStatus}>
        Clear
      </Button>
    </SelectContent>
  </Select>

  {#if loading}
    <div class="flex items-center gap-2">
      <LoaderCircleIcon class="size-4 animate-spin shrink" />
    </div>
  {/if}
</div>