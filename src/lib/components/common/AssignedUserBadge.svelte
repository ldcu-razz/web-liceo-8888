<script lang="ts" module>
	import { transformText } from "$lib/utils/texts.utils";
	import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
	import { Input } from "../ui/input";
	import type { Users } from "$lib/models/users/users.type";

  export type Props = {
    selectedUserId: string;
    showOptions?: boolean;
    users?: Users[];
  }
</script>

<script lang="ts">
  let { selectedUserId = $bindable(), users, showOptions = true }: Props = $props();

  let selectedUser = $derived(users?.find((user) => user.id === selectedUserId));

  let avatar = $derived(selectedUser?.avatar ?? DEFAULT_AVATAR);

  let userFullName = $derived(selectedUser ? transformText(`${selectedUser?.firstname} ${selectedUser?.lastname}`) : 'No assigned');

  let openMenu = $state(false);

  users = [
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      avatar: 'https://github.com/evilrabbit.png',
      rfid_number: '1234567890',
      sex: 'male',
      birthdate: '1990-01-01',
      email: 'john.doe@example.com',
      contact_number: '1234567890',
      username: 'john.doe',
      password: 'password',
      role: 'user',
      department_id: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]
</script>

{#if showOptions}
  <DropdownMenu bind:open={openMenu}>
    <DropdownMenuTrigger>
      <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm cursor-pointer">
        <Avatar class="size-5 border border-gray-200">
          <AvatarImage src={avatar} />
          <AvatarFallback class="text-xs">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span class="capitalize">{userFullName}</span>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-62 p-2" side="bottom">
      <div class="mb-2">
        <Input placeholder="Search user" class="text-xs px-2 py-1" />
      </div>
      {#each users as user}
        <DropdownMenuItem>
          <div class="flex items-center gap-1.5">
            <Avatar class="size-5 border border-gray-200">
              <AvatarImage src={user.avatar} />
              <AvatarFallback class="text-xs">{user.firstname.slice(0, 2).toUpperCase()}{user.lastname.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <span class="capitalize">{transformText(`${user.firstname} ${user.lastname}`)}</span>
          </div>
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
{:else}
  <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm">
    <Avatar class="size-5 border border-gray-200">
      <AvatarImage src={avatar} />
      <AvatarFallback class="text-xs">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <span class="capitalize">{userFullName}</span>
  </div>
{/if}