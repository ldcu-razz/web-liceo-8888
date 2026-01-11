<script lang="ts" module>
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { transformText } from '$lib/utils/texts.utils';
	import { LoaderCircleIcon, SearchIcon } from '@lucide/svelte';
	import InputGroup from '$lib/components/ui/input-group/input-group.svelte';
	import { InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { departmentsMap, departmentsStore } from '$lib/store/departments.store';
	import { allUsersMap, allUsersStore } from '$lib/store/users.store';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { untrack } from 'svelte';
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';

	export type Props = {
		searchQuery?: string;
		selectedDepartments?: string[];
		selectedUsers?: string[];
		selectedStatus?: TicketStatuses | undefined;
		disabledDepartments?: boolean;
		loading?: boolean;
		navigateToList?: () => void;
	};
</script>

<script lang="ts">
	let {
		searchQuery = $bindable(''),
		selectedDepartments = $bindable([]),
		selectedUsers = $bindable([]),
		selectedStatus = $bindable(undefined),
		disabledDepartments = false,
		loading = $bindable(false),
		navigateToList
	}: Props = $props();

	let openDepartmentsSelect = $state(false);
	let searchDepartmentsQuery = $state('');

	let searchUsersQuery = $state('');
	let openUsersSelect = $state(false);

	let allUserStore = $derived($allUsersStore);

	let usersFilteredByDepartments = $derived(
		selectedDepartments.length === 0
			? allUserStore
			: allUserStore.filter((user) => selectedDepartments.includes(user.department_id || ''))
	);

	let statuses: { label: string; value: TicketStatuses | '' }[] = [
		...TicketStatusesSchema.options.map((status) => ({
			label: transformText(status),
			value: status
		}))
	];

	let departments = $derived(
		$departmentsStore.map((department) => ({
			label: department.name,
			value: department.id,
			avatar: department.avatar
		}))
	);

	let filteredDepartments = $derived(
		departments.filter((department) =>
			department.label.toLowerCase().includes(searchDepartmentsQuery.toLowerCase())
		)
	);

	let departmentsMapData = $derived($departmentsMap);

	let users = $derived(
		usersFilteredByDepartments.map((user) => ({
			label: `${user.firstname} ${user.lastname}`,
			value: user.id,
			avatar: user.avatar
		}))
	);

	let filteredUsers = $derived(
		users.filter((user) => user.label.toLowerCase().includes(searchUsersQuery.toLowerCase()))
	);

	let usersMapData = $derived($allUsersMap);

	$effect(() => {
		selectedDepartments;

		untrack(() => {
			selectedUsers = [];
		});
	});

	function handleDepartmentSelect(_: string) {
		searchDepartmentsQuery = '';
	}

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
		if (
			status === TicketStatusesSchema.enum.archived ||
			status === TicketStatusesSchema.enum.closed
		) {
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

	<Select
		type="multiple"
		bind:value={selectedDepartments}
		bind:open={openDepartmentsSelect}
		disabled={disabledDepartments}
	>
		<SelectTrigger class="max-w-48 min-w-48">
			<span class="overflow-hidden text-ellipsis whitespace-nowrap">
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
			<div
				class="absolute top-0 left-0 z-10 flex w-full items-center justify-between gap-1 bg-white/50 p-2"
			>
				<Input type="text" bind:value={searchDepartmentsQuery} placeholder="Search departments" />
				<Button
					variant="link"
					size="sm"
					class="rounded-none py-1 text-xs text-red-500"
					onclick={handleClearDepartmentsSearch}
				>
					Clear
				</Button>
			</div>
			<div class="mt-12 max-h-62 overflow-y-auto">
				{#if filteredDepartments.length > 0}
					{#each filteredDepartments as department (department.value)}
						<SelectItem
							value={department.value}
							class="flex items-center gap-2"
							onclick={() => handleDepartmentSelect(department.value)}
						>
							<UserAvatar
								name={department.label}
								imageLink={department.avatar ?? ''}
								sizeClass="size-5"
								textSizeClass="text-[10px]"
							/>
							<span class="overflow-hidden text-xs text-ellipsis whitespace-nowrap"
								>{department.label}</span
							>
						</SelectItem>
					{/each}
				{:else}
					<div class="p-2 text-center text-sm text-gray-500">
						<span>No departments found</span>
					</div>
				{/if}
			</div>
		</SelectContent>
	</Select>

	<Select type="multiple" bind:value={selectedUsers} bind:open={openUsersSelect}>
		<SelectTrigger class="max-w-42 min-w-42">
			<span class="overflow-hidden text-ellipsis whitespace-nowrap">
				{#if selectedUsers.length === 0}
					Assignees
				{:else if selectedUsers.length === 1}
					{usersMapData[selectedUsers[0]]?.firstname} {usersMapData[selectedUsers[0]]?.lastname}
				{:else}
					{usersMapData[selectedUsers[0]]?.firstname}
					{usersMapData[selectedUsers[0]]?.lastname} +{selectedUsers.length - 1}
				{/if}
			</span>
		</SelectTrigger>
		<SelectContent class="relative min-w-72">
			<div
				class="absolute top-0 left-0 z-10 flex w-full items-center justify-between gap-1 bg-white/50 p-2"
			>
				<Input type="text" bind:value={searchUsersQuery} placeholder="Search users" />
				<Button
					variant="link"
					size="sm"
					class="rounded-none py-1 text-xs text-red-500"
					onclick={handleClearUsersSearch}
				>
					Clear
				</Button>
			</div>
			<div class="mt-12 max-h-62 overflow-y-auto">
				{#if filteredUsers.length > 0}
					{#each filteredUsers as user (user.value)}
						<SelectItem value={user.value} class="flex items-center gap-2">
							<UserAvatar
								name={user.label}
								imageLink={user.avatar ?? ''}
								sizeClass="size-5"
								textSizeClass="text-[10px]"
							/>
							<span class="overflow-hidden text-xs text-ellipsis whitespace-nowrap"
								>{user.label}</span
							>
						</SelectItem>
					{/each}
				{:else}
					<div class="p-2 text-center text-sm text-gray-500">
						<span>No users found</span>
					</div>
				{/if}
			</div>
		</SelectContent>
	</Select>

	<Select type="single" bind:value={selectedStatus}>
		<SelectTrigger class="min-w-36"
			>{selectedStatus ? transformText(selectedStatus) : 'Status'}</SelectTrigger
		>
		<SelectContent class="relative min-w-40">
			<div class="max-h-62 overflow-y-auto">
				{#each statuses as status (status.value)}
					<SelectItem
						value={status.value}
						class="text-xs"
						onclick={() => handleStatusSelect(status.value as TicketStatuses)}
						>{status.label}</SelectItem
					>
				{/each}
			</div>
			<Button
				variant="link"
				size="sm"
				class="w-full rounded-none py-1 text-xs text-red-500"
				onclick={handleClearStatus}
			>
				Clear
			</Button>
		</SelectContent>
	</Select>

	{#if loading}
		<div class="flex items-center gap-2">
			<LoaderCircleIcon class="size-4 shrink animate-spin" />
		</div>
	{/if}
</div>
