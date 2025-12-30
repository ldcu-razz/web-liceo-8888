<script lang="ts" module>
	import SelectWithSearch from "$lib/components/common/SelectWithSearch.svelte";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { TicketStatusesSchema } from "$lib/models/tickets/tickets.schema";
	import type { TicketStatuses } from "$lib/models/tickets/tickets.type";
	import { transformText } from "$lib/utils/texts.utils";
	import { LoaderCircleIcon } from "@lucide/svelte";

  export type Props = {
    selectedDepartments?: string[];
    selectedUser?: string;
    selectedStatus?: TicketStatuses | undefined;
    loading?: boolean;
  }
</script>

<script lang="ts">

  let {
    selectedDepartments = $bindable([]),
    selectedUser = $bindable(""),
    selectedStatus = $bindable(undefined),
    loading = $bindable(true)
  }: Props = $props();

  let statuses: { label: string, value: TicketStatuses | "" }[] = [
    ...TicketStatusesSchema.options.map((status) => ({
      label: transformText(status),
      value: status,
    }))
  ];

  let departments: { label: string, value: string }[] = [
    {
      label: "College of Information Technology",
      value: "College of Information Technology",
    },
    {
      label: "School of Teachers Education",
      value: "School of Teachers Education",
    },
    {
      label: "School of Business Administration",
      value: "School of Business Administration",
    },
  ];

  let users: { label: string, value: string }[] = [
    {
      label: "John Doe",
      value: "John Doe",
    },
    {
      label: "Jane Doe",
      value: "Jane Doe",
    },
    {
      label: "Jim Doe",
      value: "Jim Doe",
    },
  ];
</script>

<div class="flex items-center gap-2">
  <Select type="multiple" bind:value={selectedDepartments}>
    <SelectTrigger class="min-w-56 max-w-56">
      <span class="text-ellipsis overflow-hidden whitespace-nowrap">
        {#if selectedDepartments.length === 0}
          Departments
        {:else if selectedDepartments.length === 1}
          {selectedDepartments[0]}
        {:else}
          {selectedDepartments[0]} +{selectedDepartments.length - 1}
        {/if}
      </span>
    </SelectTrigger>
    <SelectContent>
      {#each departments as department (department.value)}
        <SelectItem value={department.value}>{department.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>

  <SelectWithSearch options={users} value={selectedUser} noItemsMessage="No users found" inputPlaceholder="Assignee" />

  <Select type="single" bind:value={selectedStatus}>
    <SelectTrigger class="min-w-36">{selectedStatus ? transformText(selectedStatus) : "Status"}</SelectTrigger>
    <SelectContent class="min-w-40">
      {#each statuses as status (status.value)}
        <SelectItem value={status.value}>{status.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>

  {#if loading}
    <LoaderCircleIcon class="size-4 animate-spin" />
  {/if}
</div>