<script lang="ts" module>
	import { transformText } from '$lib/utils/texts.utils';
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
	import { DEFAULT_AVATAR } from '$lib/constants/avatar.constants';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { Input } from '../ui/input';
	import type { Users } from '$lib/models/users/users.type';
	import { allUsersStore, nonMemberUsersStore } from '$lib/store/users.store';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import UserAvatar from './UserAvatar.svelte';

	export type Props = {
		selectedUserId: string | null;
		showOptions?: boolean;
		users?: Users[];
		onUserChange?: (userId: string) => void;
	};
</script>

<script lang="ts">
	let { selectedUserId = $bindable(), showOptions = true, onUserChange }: Props = $props();

	let search = $state('');

	let users = $derived($allUsersStore ?? []);

	let nonMemberUsers = $derived($nonMemberUsersStore ?? []);

	let filteredUsers = $derived(
		nonMemberUsers?.filter((user) =>
			`${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
		)
	);

	let selectedUser = $derived(users?.find((user) => user.id === selectedUserId));

	let avatar = useSignedUrl(() => selectedUser?.avatar);

	let userFullName = $derived(
		selectedUser
			? transformText(`${selectedUser?.firstname} ${selectedUser?.lastname}`)
			: 'Unassigned Staff'
	);

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

	function handleUnassignedSelect() {
		selectedUserId = null;
		onUserChange?.('');
		openMenu = false;
		search = '';
	}
</script>

{#if showOptions}
	<DropdownMenu bind:open={openMenu}>
		<DropdownMenuTrigger>
			<div
				class="flex cursor-pointer items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
			>
				<UserAvatar
					name={userFullName}
					imageLink={selectedUser?.avatar ?? ''}
					sizeClass="size-5"
					textSizeClass="text-[10px]"
				/>
				<span class="max-w-42 overflow-hidden text-ellipsis whitespace-nowrap capitalize"
					>{userFullName}</span
				>
			</div>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="min-w-62 p-2" side="bottom">
			<div class="absolute top-0 left-0 mb-2 w-full p-2">
				<Input placeholder="Search user" class="px-2 py-1 text-xs" bind:value={search} />
			</div>
			<div class="mt-12 max-h-62 overflow-y-auto">
				{#if filteredUsers.length > 0}
					<DropdownMenuItem onclick={() => handleUnassignedSelect()}>
						<div class="flex items-center gap-1.5">
							<UserAvatar name={'Unassigned'} sizeClass="size-5" textSizeClass="text-[10px]" />
							<span
								class="max-w-50 overflow-hidden text-xs text-ellipsis whitespace-nowrap capitalize"
								>Unassigned</span
							>
						</div>
					</DropdownMenuItem>
					{#each filteredUsers as user}
						<DropdownMenuItem onclick={() => handleUserSelect(user.id)}>
							<div class="flex items-center gap-1.5">
								<UserAvatar
									name={`${user.firstname} ${user.lastname}`}
									imageLink={user.avatar ?? ''}
									sizeClass="size-5"
									textSizeClass="text-[10px]"
								/>
								<span
									class="max-w-32 overflow-hidden text-xs text-ellipsis whitespace-nowrap capitalize"
									>{transformText(`${user.firstname} ${user.lastname}`)}</span
								>
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
	<div
		class="flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
	>
		<Avatar class="size-5 border border-gray-200">
			<AvatarImage src={avatar.url} class="object-cover" />
			<AvatarFallback class="text-[8px]">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
		<span class="capitalize">{userFullName}</span>
	</div>
{/if}
