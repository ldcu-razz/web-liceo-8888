<script lang="ts" module>
  import type { Departments } from "$lib/models/departments/departments.type";
	import { transformText } from "$lib/utils/texts.utils";
	import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
	import { Input } from "../ui/input";
	import { CheckCircle, CheckIcon } from "@lucide/svelte";

  export type Props = {
    selectedDepartmentId: string;
    departments?: Departments[];
  }
</script>

<script lang="ts">
  let { selectedDepartmentId, departments }: Props = $props();

  let selectedDepartment = $derived(departments?.find((department) => department.id === selectedDepartmentId));

  let avatar = $derived(selectedDepartment?.avatar ?? DEFAULT_AVATAR);

  let departmentName = $derived(transformText(selectedDepartment?.name ?? 'No assigned'));

  let openMenu = $state(false);

  departments = [
    {
      id: '1',
      name: 'Department 1',
      avatar: 'https://github.com/evilrabbit.png',
      abbv: 'DEPT',
      description: 'Department 1 description',
      keywords: ['keyword1', 'keyword2'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Department 2',
      avatar: 'https://github.com/evilrabbit.png',
      abbv: 'DEPT',
      description: 'Department 2 description',
      keywords: ['keyword3', 'keyword4'],
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
</script>

<DropdownMenu bind:open={openMenu}>
  <DropdownMenuTrigger>
    <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm cursor-pointer">
      <Avatar class="size-5 border border-gray-200">
        <AvatarImage src={avatar} />
        <AvatarFallback class="text-xs">{selectedDepartment?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span class="capitalize">{departmentName}</span>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent class="min-w-62 p-2" side="bottom">
    <div class="mb-2">
      <Input placeholder="Search departments" class="text-xs px-2 py-1" />
    </div>
    {#each departments as department}
      <DropdownMenuItem>
        <div class="flex items-center justify-between gap-2 w-full">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5">
              <Avatar class="size-5 border border-gray-200">
                <AvatarImage src={department.avatar} />
                <AvatarFallback class="text-xs">{department.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div class="capitalize text-ellipsis overflow-hidden whitespace-nowrap">{transformText(department.name)}</div>
          </div>

          <CheckIcon class="size-4 text-green-700" />
        </div>
      </DropdownMenuItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>