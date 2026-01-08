<script lang="ts" module>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { STUDENT_TICKETS } from '$lib';
	import { Button } from '$lib/components/ui/button';
	import {
		TicketsPrioritiesSchema,
		TicketStatusesSchema
	} from '$lib/models/tickets/tickets.schema';
	import type { GetTicket, TicketStatuses } from '$lib/models/tickets/tickets.type';
	import {
		ArrowLeftIcon,
		Building2Icon,
		BuildingIcon,
		HistoryIcon,
		ListStartIcon
	} from '@lucide/svelte';
	import TicketIcon from '../../TicketIcon.svelte';
</script>

<script lang="ts">
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';
	import { AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion';
	import { transformText } from '$lib/utils/texts.utils';
	import TicketStatusTrail from './TicketStatusTrail.svelte';

	let ticket = $state<GetTicket>({
		id: '1',
		title: 'Ticket 1',
		description: 'Description 1',
		status: TicketStatusesSchema.enum.in_review,
		priority: TicketsPrioritiesSchema.enum.low,
		category_id: '1',
		code: '123456',
		category: {
			id: '1',
			name: 'Category 1'
		},
		current_department_assigned: {
			id: '1',
			name: 'Department 1',
			abbv: 'DEPT'
		},
		current_user_assigned: {
			id: '1',
			firstname: 'John',
			lastname: 'Doe',
			avatar: 'https://github.com/shadcn.png'
		},
		reported_by: {
			id: '1',
			firstname: 'John',
			lastname: 'Doe',
			avatar: 'https://github.com/shadcn.png'
		},
		files: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});
	let ticketCreatedAt = $derived(
		new Date(ticket.createdAt).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})
	);

	let descriptionAccordionValue = $state('description');

	function goBackToTickets() {
		goto(STUDENT_TICKETS);
	}
</script>

<section class="px-4">
	<div class="align-center mt-4 flex flex-col gap-3 pt-3">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="icon-sm" class="p-0! text-gray-700" onclick={goBackToTickets}>
				<ArrowLeftIcon class="size-4" />
			</Button>

			<div class="text-md line-clamp-1 font-semibold text-ellipsis">{ticket.title}</div>
		</div>
	</div>

	<div class="mt-4 flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<TicketIcon status={ticket.status as TicketStatuses} classSize="size-5" />
				<div class="text-xs font-semibold text-gray-600">{ticket.code}</div>
			</div>
			<h3 class="text-lg font-bold">{ticket.title}</h3>
		</div>

		<Accordion
			type="single"
			value={descriptionAccordionValue}
			class="-mx-4 border-y border-gray-200 bg-white px-4"
		>
			<AccordionItem value={descriptionAccordionValue}>
				<AccordionTrigger class="text-xs font-semibold">Description</AccordionTrigger>
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
				class="-mx-4 flex items-center justify-between gap-2 border-y border-gray-200 bg-white p-4 text-xs"
			>
				<div class="flex gap-2">
					<Building2Icon class="size-4 text-gray-600" />
					<span class="font-semibold">Department Assigned</span>
				</div>

				<span>{ticket.current_department_assigned?.name}</span>
			</div>

			<div
				class="-mx-4 flex items-center justify-between gap-2 border-b border-gray-200 bg-white p-4 text-xs"
			>
				<div class="flex gap-2">
					<ListStartIcon class="size-4 text-gray-600" />
					<span class="font-semibold">Priority</span>
				</div>

				<span>{transformText(ticket.priority)}</span>
			</div>

			<div
				class="-mx-4 flex items-center justify-between gap-2 border-b border-gray-200 bg-white p-4 text-xs"
			>
				<div class="flex gap-2">
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
</section>
