<script lang="ts" module>
	import TicketStatusBadge from '$lib/components/common/TicketStatusBadge.svelte';
	import { Button } from '$lib/components/ui/button';
	import type {
		GetTicket,
		TicketsPriorities,
		TicketStatuses
	} from '$lib/models/tickets/tickets.type';
	import {
		HistoryIcon,
		Share2Icon,
		TablePropertiesIcon,
		TagIcon,
		TrashIcon,
		XIcon
	} from '@lucide/svelte';
	import TicketDetailItem from './TicketsDetaiItem.svelte';
	import AssignedDepartmentBadge from '$lib/components/common/AssignedDepartmentBadge.svelte';
	import AssignedUserBadge from '$lib/components/common/AssignedUserBadge.svelte';
	import { ticketsActions } from '$lib/store/tickets.store';
	import TicketPriorityBadge from '$lib/components/common/TicketPriorityBadge.svelte';
	import ButtonGroup from '$lib/components/ui/button-group/button-group.svelte';
	import TicketHistory from '$lib/components/common/TicketHistory.svelte';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import TicketCommentSection from './TicketCommentSection.svelte';
	import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import AnonymousBadge from '$lib/components/common/AnonymousBadge.svelte';
	import FilePlaceholder from '$lib/components/common/FilePlaceholder.svelte';
	import { goto } from '$app/navigation';

	export type Props = {
		ticket: GetTicket;
		disabledDeleteTicketButton?: boolean;
		hideCloseButton?: boolean;
		hideShareButton?: boolean;
		close: () => void;
	};

	const propertiesTab = 'propertiesTab';
	const historyTab = 'historyTab';
</script>

<script lang="ts">
	let {
		ticket,
		disabledDeleteTicketButton = false,
		hideCloseButton = false,
		hideShareButton = false,
		close
	}: Props = $props();

	let activeTab = $state(propertiesTab);

	let showDeleteTicketModal = $state(false);

	let isEditDescription = $state(false);

	let descriptionValue = $state('');

	let isAnonymous = $derived(ticket.anon);

	let ticketFiles = $derived(ticket.files);

	function handleStatusChangeTicketStatus(status: TicketStatuses) {
		ticketsActions.changeTicketStatus(ticket.id, status);
	}

	function handleDepartmentChangeAssignedDepartment(departmentId: string) {
		ticketsActions.changeAssignedDepartment(ticket.id, departmentId);
	}

	function handleUserChangeAssignedUser(userId: string) {
		ticketsActions.changeAssignedUser(ticket.id, userId);
	}

	function handlePriorityChangeTicketPriority(priority: TicketsPriorities) {
		ticketsActions.changeTicketPriority(ticket.id, priority);
	}

	function handleOpenDeleteTicketModal() {
		showDeleteTicketModal = true;
	}

	function handleDeleteTicket() {
		ticketsActions.deleteTicket(ticket.id);
		goto('/main/tickets/board');
		close();
	}

	function handleEditDescription() {
		isEditDescription = true;
		descriptionValue = ticket.description;
	}

	function handleDescriptionKeydown(event: KeyboardEvent) {
		if (isEditDescription) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleEditDescription();
		}
	}

	async function handleSaveEditDescription() {
		await ticketsActions.updateTicketDescription(ticket.id, descriptionValue);
		ticket = { ...ticket, description: descriptionValue };
		isEditDescription = false;
		descriptionValue = '';
	}

	function handleCopyTicketLink() {
		ticketsActions.copyTicketLink(ticket.id);
	}
</script>

<section class="flex max-h-[80vh] min-h-0 flex-col">
	<header class="flex shrink-0 justify-between">
		<div class="flex flex-col gap-1">
			<div class="mb-4 flex items-center gap-2">
				<TagIcon class="size-4 text-gray-500" />
				<h1 class="text-sm font-semibold">{ticket.code}</h1>
			</div>
			<div class="flex flex-col gap-0.5">
				<h2 class="text-lg font-semibold break-word">{ticket.title}</h2>
				{#if ticket.category}
					<div class="w-fit rounded-sm border border-gray-300 p-1">
						<div class="text-[10px] font-semibold">{ticket.category?.name}</div>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex h-fit gap-1">
			{#if !disabledDeleteTicketButton}
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger>
							<Button variant="outline" size="icon-sm" onclick={handleOpenDeleteTicketModal}>
								<TrashIcon class="size-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={4} hideArrow={true}>
							Delete Ticket
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			{/if}
			{#if !hideShareButton}
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger>
							<Button variant="outline" size="icon-sm" onclick={handleCopyTicketLink}>
								<Share2Icon class="size-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={4} hideArrow={true}>
							Copy Ticket Link
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			{/if}
			{#if !hideCloseButton}
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger>
							<Button variant="outline" size="icon-sm" onclick={close}>
								<XIcon class="size-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={4} hideArrow={true}>Close Ticket</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			{/if}
		</div>
	</header>

	<section class="mt-4 grid max-h-full flex-1 grid-cols-10 gap-4 overflow-hidden">
		<div class="col-span-6 flex flex-col overflow-y-auto pr-3 break-word">
			<h3 class="mb-2 shrink-0 text-sm font-semibold">Description</h3>
			{#if isEditDescription}
				<RichTextEditor
					bind:value={descriptionValue}
					placeholder="Edit description"
					hideAvatar={true}
				/>
				<div class="mt-2 flex justify-end gap-2">
					<Button variant="outline" size="sm" onclick={() => (isEditDescription = false)}
						>Cancel</Button
					>
					<Button variant="secondary" size="sm" onclick={handleSaveEditDescription}>Save</Button>
				</div>
			{:else}
				<div
					class="mb-4 min-h-24 shrink-0 cursor-pointer rounded-sm p-1 hover:bg-gray-100"
					role="button"
					tabindex="0"
					onclick={handleEditDescription}
					onkeydown={handleDescriptionKeydown}
				>
					<p class="text-sm whitespace-pre-line">{@html ticket.description}</p>
				</div>

				{#if ticketFiles.length > 0}
					<div class="mt-4 flex flex-col gap-2">
						<h3 class="mb-2 shrink-0 text-sm font-semibold">Attachments</h3>
						<div class="flex gap-2 overflow-x-auto">
							{#each ticketFiles as file}
								{@const isNonMediaFile = file.type !== 'image' && file.type !== 'video'}
								{@const sizeClass = isNonMediaFile ? 'w-52 h-32' : 'size-32'}
								<div class={sizeClass}>
									<FilePlaceholder {file} />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/if}

			<div class="mt-auto min-h-0 flex-1 pt-8">
				<TicketCommentSection {ticket} />
			</div>
		</div>

		<div class="col-span-4 flex flex-col gap-2 overflow-hidden">
			<div class="flex flex-1 flex-col overflow-y-auto rounded-sm border border-gray-200 p-4">
				<div class="mb-6">
					<ButtonGroup>
						<ButtonGroup>
							<Button
								variant="outline"
								size="sm"
								aria-label="Go Back"
								class={activeTab === propertiesTab ? 'bg-gray-100' : ''}
								onclick={() => (activeTab = propertiesTab)}
							>
								<TablePropertiesIcon class="size-3" />
								<span class="text-xs">Properties</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								aria-label="Go Back"
								class={activeTab === historyTab ? 'bg-gray-100' : ''}
								onclick={() => (activeTab = historyTab)}
							>
								<HistoryIcon class="size-3" />
								<span class="text-xs">History</span>
							</Button>
						</ButtonGroup>
					</ButtonGroup>
				</div>
				{#if activeTab === propertiesTab}
					<div class="flex flex-col gap-3">
						<TicketDetailItem title="Status">
							<TicketStatusBadge
								selectedStatus={ticket.status}
								size="sm"
								onStatusChange={handleStatusChangeTicketStatus}
							/>
						</TicketDetailItem>

						<TicketDetailItem title="Department Assigned">
							<AssignedDepartmentBadge
								selectedDepartmentId={ticket.current_department_assigned?.id ?? ''}
								onDepartmentChange={handleDepartmentChangeAssignedDepartment}
							/>
						</TicketDetailItem>

						<TicketDetailItem title="Assigned to">
							<AssignedUserBadge
								selectedUserId={ticket.current_user_assigned?.id ?? ''}
								onUserChange={handleUserChangeAssignedUser}
							/>
						</TicketDetailItem>

						<TicketDetailItem title="Reported by">
							{#if isAnonymous}
								<AnonymousBadge />
							{:else}
								<AssignedUserBadge
									selectedUserId={ticket.reported_by?.id ?? ''}
									showOptions={false}
								/>
							{/if}
						</TicketDetailItem>

						<TicketDetailItem title="Priority">
							<TicketPriorityBadge
								selectedPriority={ticket.priority}
								onPriorityChange={handlePriorityChangeTicketPriority}
							/>
						</TicketDetailItem>

						<TicketDetailItem title="Created At">
							<div class="flex items-center gap-1 rounded-sm border border-gray-200 px-2.5 py-1">
								<span class="text-xs"
									>{new Date(ticket.createdAt)
										.toLocaleString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
											hour: 'numeric',
											minute: '2-digit',
											hour12: true
										})
										.replace(', ', ' ')
										.replace(/\s(AM|PM)/, '$1')}</span
								>
							</div>
						</TicketDetailItem>

						<TicketDetailItem title="Updated At">
							<div class="flex items-center gap-1 rounded-sm border border-gray-200 px-2.5 py-1">
								<span class="text-xs"
									>{new Date(ticket.updatedAt)
										.toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
											hour: 'numeric',
											minute: '2-digit',
											hour12: true
										})
										.replace(', ', ' ')
										.replace(/\s(AM|PM)/, '$1')}</span
								>
							</div>
						</TicketDetailItem>
					</div>
				{/if}

				{#if activeTab === historyTab}
					<div class="max-h-[calc(80vh-230px)] overflow-y-auto">
						<TicketHistory ticketId={ticket.id} isAnonymous={isAnonymous} />
					</div>
				{/if}
			</div>
		</div>
	</section>
</section>

<AlertDialog bind:open={showDeleteTicketModal}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Delete Ticket</AlertDialogTitle>
			<AlertDialogDescription>Are you sure you want to delete this ticket?</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<Button variant="destructive" onclick={handleDeleteTicket}>Yes, delete</Button>
			<Button variant="outline" onclick={() => (showDeleteTicketModal = false)}>Cancel</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
