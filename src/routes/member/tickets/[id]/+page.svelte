<script lang="ts" module>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { MEMBER_TICKETS } from '$lib';
	import type { TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { Building2Icon, HistoryIcon, ListStartIcon } from '@lucide/svelte';
	import TicketIcon from '../../TicketIcon.svelte';
</script>

<script lang="ts">
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';
	import { AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion';
	import { transformText } from '$lib/utils/texts.utils';
	import TicketStatusTrail from './TicketStatusTrail.svelte';
	import TicketCommentSection from '../../../main/tickets/board/TicketCommentSection.svelte';
	import AppBar from '../../AppBar.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { currentTicket, currentTicketLoading, ticketsActions } from '$lib/store/tickets.store';

	let ticketId = $state(page.params.id);

	let ticket = $derived($currentTicket);

	let loading = $derived($currentTicketLoading);

	let ticketCreatedAt = $derived(
		new Date(ticket?.createdAt || '').toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})
	);

	let descriptionAccordionValue = $state('description');

	onMount(async () => {
		if (ticketId) {
			await ticketsActions.getTicket(ticketId);
		}
	});

	function goBackToTickets() {
		goto(MEMBER_TICKETS);
	}
</script>

{#snippet loadingSkeleton()}
	<div class="mt-24 flex flex-col gap-2">
		<Skeleton class="h-42 w-full rounded-md" />
		<Skeleton class="h-20 w-full rounded-md" />
		<Skeleton class="h-20 w-full rounded-md" />
	</div>
{/snippet}

<section class="relative px-4">
	<AppBar title={ticket?.title ?? ''} backButton={true} backButtonOnClick={goBackToTickets} />

	{#if loading}
		{@render loadingSkeleton()}
	{:else if ticket}
		<div class="flex flex-col gap-4 pt-24">
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<TicketIcon status={ticket.status as TicketStatuses} classSize="size-6" />
					<div class="text-sm font-semibold text-gray-500">{ticket.code}</div>
				</div>
				<h3 class="text-xl font-bold break-all">{ticket.title}</h3>
			</div>

			<Accordion
				type="single"
				value={descriptionAccordionValue}
				class="-mx-4 border-y border-gray-200 bg-white px-4"
			>
				<AccordionItem value={descriptionAccordionValue}>
					<AccordionTrigger class="text-sm font-semibold">Description</AccordionTrigger>
					<AccordionContent>
						<p class="text-sm">{@html ticket.description}</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>

		<div class="mt-8 flex flex-col gap-2">
			<div class="text-sm font-semibold">Details</div>
			<div class="flex flex-col">
				<div
					class="-mx-4 flex items-center justify-between gap-2 border-y border-gray-200 bg-white p-4 text-sm"
				>
					<div class="flex items-center gap-2">
						<Building2Icon class="size-4 text-gray-600" />
						<span class="font-semibold">Department Assigned</span>
					</div>

					<span>{ticket.current_department_assigned?.name || 'No department assigned'}</span>
				</div>

				<div
					class="-mx-4 flex items-center justify-between gap-2 border-b border-gray-200 bg-white p-4 text-sm"
				>
					<div class="flex items-center gap-2">
						<ListStartIcon class="size-4 text-gray-600" />
						<span class="font-semibold">Priority</span>
					</div>

					<span>{transformText(ticket.priority || 'No priority selected')}</span>
				</div>

				<div
					class="-mx-4 flex items-center justify-between gap-2 border-b border-gray-200 bg-white p-4 text-sm"
				>
					<div class="flex items-center gap-2">
						<HistoryIcon class="size-4 text-gray-600" />
						<span class="font-semibold">Created At</span>
					</div>

					<span>{ticketCreatedAt}</span>
				</div>
			</div>
		</div>

		<div class="mt-8 flex flex-col gap-2">
			<div class="text-sm font-semibold">Status</div>
			<TicketStatusTrail status={ticket.status as TicketStatuses} />
		</div>

		<div class="mt-4 flex flex-col gap-2">
			<div class="text-sm font-semibold">Comments</div>
			<div class="mt-4">
				<TicketCommentSection ticketId={ticket.id} />
			</div>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center">No ticket found</div>
	{/if}
</section>
