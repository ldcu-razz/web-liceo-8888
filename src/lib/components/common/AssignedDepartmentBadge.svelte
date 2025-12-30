<script lang="ts" module>
  import type { Departments } from "$lib/models/departments/departments.type";
	import { transformText } from "$lib/utils/texts.utils";
	import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
	import { Input } from "../ui/input";
	import { CheckIcon } from "@lucide/svelte";
	import { departmentsStore } from "$lib/store/departments.store";

  export type Props = {
    selectedDepartmentId: string | null;
    onDepartmentChange?: (departmentId: string) => void;
  }
</script>

<script lang="ts">
  let { selectedDepartmentId = $bindable(), onDepartmentChange }: Props = $props();

  let departments = $derived($departmentsStore ?? []);

  let search = $state('');

  let filteredDepartments = $derived(departments?.filter((department) => department.name.toLowerCase().includes(search.toLowerCase())));

  let selectedDepartment = $derived(departments?.find((department) => department.id === selectedDepartmentId));

  let avatar = $derived(selectedDepartment?.avatar ?? DEFAULT_AVATAR);

  let departmentName = $derived(transformText(selectedDepartment?.name ?? 'Assigned Department'));

  let openMenu = $state(false);

  function handleDepartmentSelect(departmentId: string) {
    selectedDepartmentId = departmentId;
    openMenu = false;
    search = '';
    onDepartmentChange?.(departmentId);
  }
</script>

<DropdownMenu bind:open={openMenu}>
  <DropdownMenuTrigger>
    <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm cursor-pointer">
      <Avatar class="size-5 border border-gray-200">
        <AvatarImage src={avatar} />
        <AvatarFallback class="text-[8px]">{selectedDepartment?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span class="capitalize max-w-42 text-ellipsis overflow-hidden whitespace-nowrap">{departmentName}</span>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent class="min-w-62 p-2 relative" side="bottom">
    <div class="mb-2 p-2 absolute top-0 left-0 w-full">
      <Input bind:value={search} placeholder="Search departments" class="text-xs px-2 py-1 w-full" />
    </div>
    <div class="mt-12 max-w-62 max-h-62 overflow-y-auto">
      {#each filteredDepartments as department}
        <DropdownMenuItem onclick={() => handleDepartmentSelect(department.id)}>
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5">
                <Avatar class="size-5 border border-gray-200">
                  <AvatarImage src={department.avatar} />
                  <AvatarFallback class="text-[10px]">{department.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div class="capitalize text-ellipsis text-xs overflow-hidden whitespace-nowrap max-w-50">{department.name}</div>
            </div>
  
            {#if department.id === selectedDepartmentId}
              <CheckIcon class="size-4 text-green-700" />
            {/if}
          </div>
        </DropdownMenuItem>
      {/each}
    </div>
  </DropdownMenuContent>
</DropdownMenu>