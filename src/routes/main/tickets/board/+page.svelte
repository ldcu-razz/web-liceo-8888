<script lang="ts">
	import { TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import Tabs from '$lib/components/ui/tabs/tabs.svelte';
	import { ChevronDownIcon, ListIcon, PlusIcon, PresentationIcon } from '@lucide/svelte';
	import TicketsBoard from './kanban-board/TicketsBoard.svelte';
	import type { GetTicket, PostTicket, TicketStatuses } from '$lib/models/tickets/tickets.type';
	import TicketsList from './list/TicketsList.svelte';
	import TicketsFilters from './TicketsFilters.svelte';
	import Dialog from '$lib/components/ui/dialog/dialog.svelte';
	import { DialogContent, DialogTitle } from '$lib/components/ui/dialog';
	import {
		ticketsActions,
		ticketsLoading,
		ticketsStore,
		ticketsTotalCount
	} from '$lib/store/tickets.store';
	import { onMount, untrack } from 'svelte';
	import TicketsDetails from './TicketsDetails.svelte';
	import { Button } from '$lib/components/ui/button';
	import CreateTicketForm, {
		initialFormData,
		type FormData as CreateTicketFormData
	} from '../CreateTicketForm.svelte';
	import { uuid } from '$lib/utils/uuid.util';
	import { meStore } from '$lib/store/me.store';
	import { debounce } from '$lib/utils/reactive.utils';
	import { UserRolesEnumSchema } from '$lib/models/users/users.schema';

	let tickets = $derived($ticketsStore);
	let loading = $derived($ticketsLoading);
	let totalCount = $derived($ticketsTotalCount);

	// Search and Filters
	let searchQuery = $state('');
	let selectedDepartments = $state<string[]>([]);
	let selectedUsers = $state<string[]>([]);
	let selectedStatus = $state<TicketStatuses | undefined>(undefined);

	let showTicketDetails = $state(false);
	let selectedTicketId = $state<string | null>(null);
	let selectedTicket = $derived(tickets.find((t) => t.id === selectedTicketId));

	let showCreateTicketForm = $state(false);
	let createTicketFormData = $state<CreateTicketFormData>({ ...initialFormData });
	let createTicketFormLoading = $state(false);

	let isTickerReachedMaxLimit = $derived(tickets.length >= totalCount);

	let activeTab = $state('board');

	let me = $derived($meStore);
	let isMeRoleDepartmentStaff = $derived(me?.role === UserRolesEnumSchema.enum.department_staff);

	let disabledDeleteTicketButton = $derived(
		me?.role === UserRolesEnumSchema.enum.department_staff ||
			me?.role === UserRolesEnumSchema.enum.user
	);

	let isFirstMount = $state(true);

	const debouncedSearch = debounce(
		({
			query,
			departmentsAssignedIds,
			usersAssignedIds,
			status
		}: {
			query: string;
			departmentsAssignedIds?: string[];
			usersAssignedIds?: string[];
			status?: TicketStatuses[];
		}) => {
			ticketsActions.getTickets(
				{ page: 1, size: 20 },
				query,
				departmentsAssignedIds,
				usersAssignedIds,
				[],
				status
			);
		},
		500
	);

	$effect(() => {
		if (isMeRoleDepartmentStaff) {
			selectedDepartments = [me?.department_id || ''];
		}
	});

	$effect(() => {
		const q = searchQuery;

		untrack(() => {
			if (isFirstMount) {
				return;
			}

			const departmentsAssignedIds = selectedDepartments;
			const usersAssignedIds = selectedUsers;
			const status = selectedStatus ? [selectedStatus] : [];
			debouncedSearch({ query: q, departmentsAssignedIds, usersAssignedIds, status });
		});
	});

	$effect(() => {
		const departmentsAssignedIds = selectedDepartments;
		const usersAssignedIds = selectedUsers;
		const status = selectedStatus ? [selectedStatus] : [];
		untrack(() => {
			ticketsActions.getTickets(
				{ page: 1, size: 20 },
				searchQuery,
				departmentsAssignedIds,
				usersAssignedIds,
				[],
				status
			);
		});
	});

	onMount(() => {
		isFirstMount = false;
	});

	function handleTicketClick(ticket: GetTicket) {
		selectedTicketId = ticket.id;
		showTicketDetails = true;
	}

	function toggleCreateTicketForm() {
		showCreateTicketForm = !showCreateTicketForm;
	}

	function handleShowMoreTickets() {
		ticketsActions.getTickets({ page: 1, size: 20 });
	}

	async function handleAddTicketClick(formData: CreateTicketFormData) {
		createTicketFormLoading = true;
		const payload: PostTicket = {
			...formData,
			id: uuid(),
			category_id: formData.category_id,
			anon: false,
			priority: (formData.priority as PostTicket['priority']) || 'medium',
			reported_by: me?.id || '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		await ticketsActions.createTicket(payload);

		showCreateTicketForm = false;
		createTicketFormLoading = false;
		createTicketFormData = { ...initialFormData };
	}

	function handleNavigateToList() {
		activeTab = 'list';
	}
</script>

<div class="mx-auto flex h-full min-h-0 w-full max-w-full flex-1 flex-col gap-4">
	<div class="mb-2 flex items-center justify-between">
		<h5 class="text-xl font-semibold">Tickets {activeTab === 'board' ? 'Board' : 'List'}</h5>
		<div class="flex items-center gap-2">
			<Button variant="secondary" onclick={toggleCreateTicketForm}>
				<PlusIcon class="size-4" />
				Create Ticket
			</Button>
		</div>
	</div>
	<div class="flex items-center justify-between gap-4">
		<TicketsFilters
			bind:searchQuery
			bind:selectedDepartments
			bind:selectedUsers
			bind:selectedStatus
			disabledDepartments={isMeRoleDepartmentStaff}
			{loading}
			navigateToList={handleNavigateToList}
		/>

		<div class="flex items-center gap-2">
			<span class="text-sm text-gray-500">{tickets.length}/{totalCount} tickets</span>
			<Button
				variant="outline"
				size="sm"
				disabled={loading || isTickerReachedMaxLimit}
				onclick={handleShowMoreTickets}
			>
				<ChevronDownIcon class="size-4" />
				Show more tickets
			</Button>
			<Tabs bind:value={activeTab} class="">
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
			</Tabs>
		</div>
	</div>

	<div class="flex h-full min-h-0 max-w-full min-w-0 flex-1 flex-col">
		{#if activeTab === 'board'}
			<TicketsBoard {tickets} {loading} class="min-h-0 flex-1" onTicketClick={handleTicketClick} />
		{:else}
			<TicketsList {tickets} onTicketClick={handleTicketClick} />
		{/if}
	</div>
</div>

<Dialog bind:open={showTicketDetails}>
	<DialogContent
		showCloseButton={false}
		class="max-h-[90vh] min-h-[80vh] sm:max-w-7xl"
		trapFocus={false}
	>
		{#if selectedTicket}
			<TicketsDetails
				ticket={selectedTicket}
				{disabledDeleteTicketButton}
				close={() => (showTicketDetails = false)}
			/>
		{/if}
	</DialogContent>
</Dialog>

<Dialog bind:open={showCreateTicketForm}>
	<DialogContent class="sm:max-w-2xl">
		<DialogTitle>Create Ticket</DialogTitle>
		<CreateTicketForm
			bind:formData={createTicketFormData}
			loading={createTicketFormLoading}
			onSubmit={handleAddTicketClick}
			onCancel={toggleCreateTicketForm}
		/>
	</DialogContent>
</Dialog>
