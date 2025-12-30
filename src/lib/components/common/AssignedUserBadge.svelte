<script lang="ts" module>
	import { transformText } from "$lib/utils/texts.utils";
	import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
	import { Input } from "../ui/input";
	import type { Users } from "$lib/models/users/users.type";
	import { allUsersStore, nonMemberUsersStore } from "$lib/store/users.store";

  export type Props = {
    selectedUserId: string | null;
    showOptions?: boolean;
    users?: Users[];
    onUserChange?: (userId: string) => void;
  }
</script>

<script lang="ts">
  let { selectedUserId = $bindable(), showOptions = true, onUserChange }: Props = $props();

  let search = $state('');

  let users = $derived($allUsersStore ?? []);

  let nonMemberUsers = $derived($nonMemberUsersStore ?? []);

  let filteredUsers = $derived(nonMemberUsers?.filter((user) => `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())));

  let selectedUser = $derived(users?.find((user) => user.id === selectedUserId));

  let avatar = $derived(selectedUser?.avatar ?? DEFAULT_AVATAR);

  let userFullName = $derived(selectedUser ? transformText(`${selectedUser?.firstname} ${selectedUser?.lastname}`) : 'Assigned User');

  let openMenu = $state(false);

  function getUserInitial(user: Users) {
    return user.firstname.slice(0, 1).toUpperCase() + user.lastname.slice(0, 1).toUpperCase();
  }

  function handleUserSelect(userId: string) {
    selectedUserId = userId;
    onUserChange?.(userId);
    openMenu = false;
    search = '';
  }
</script>

{#if showOptions}
  <DropdownMenu bind:open={openMenu}>
    <DropdownMenuTrigger>
      <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm cursor-pointer">
        <Avatar class="size-5 border border-gray-200">
          <AvatarImage src={avatar} />
          <AvatarFallback class="text-[8px]">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span class="capitalize max-w-42 text-ellipsis overflow-hidden whitespace-nowrap">{userFullName}</span>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-62 p-2" side="bottom">
      <div class="mb-2 p-2 absolute top-0 left-0 w-full">
        <Input placeholder="Search user" class="text-xs px-2 py-1" bind:value={search} />
      </div>
      <div class="mt-12 max-h-62 overflow-y-auto">
        {#if filteredUsers.length > 0}
          {#each filteredUsers as user}
            <DropdownMenuItem onclick={() => handleUserSelect(user.id)}>
              <div class="flex items-center gap-1.5">
                <Avatar class="size-6 border border-gray-200">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback class="text-xs">{getUserInitial(user)}</AvatarFallback>
                </Avatar>
    
                <span class="capitalize max-w-32 text-xs text-ellipsis overflow-hidden whitespace-nowrap">{transformText(`${user.firstname} ${user.lastname}`)}</span>
              </div>
            </DropdownMenuItem>
          {/each}
        {:else}
          <DropdownMenuItem class="text-center text-sm text-gray-500">
            <span>No users found</span>
          </DropdownMenuItem>
        {/if}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
{:else}
  <div class="flex items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-sm">
    <Avatar class="size-5 border border-gray-200">
      <AvatarImage src={avatar} />
      <AvatarFallback class="text-[8px]">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <span class="capitalize">{userFullName}</span>
  </div>
{/if}