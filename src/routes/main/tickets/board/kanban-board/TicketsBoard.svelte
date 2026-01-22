<script lang="ts" module>
	import { Badge } from '$lib/components/ui/badge';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { GetTicket, Ticket, TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { transformText } from '$lib/utils/texts.utils';
	import TicketsCard from '../TicketsCard.svelte';

	type BoardColumnBase = {
		id: TicketStatuses;
		title: TicketStatuses;
		description: string;
		colorClass: string;
	};

	type BoardColumn = BoardColumnBase & {
		items: GetTicket[];
	};

	type Props = {
		tickets: GetTicket[];
		loading?: boolean;
		class: string;
		onTicketClick?: (ticket: GetTicket) => void;
	};
</script>

<script lang="ts">
	import { draggable, droppable } from '$lib/utils/drag-drop.utils';
	import { ticketsActions } from '$lib/store/tickets.store';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { tickets, loading = false, class: className = '', onTicketClick }: Props = $props();

	let baseColumns = $state<BoardColumnBase[]>([
		{
			id: TicketStatusesSchema.enum.backlog,
			title: TicketStatusesSchema.enum.backlog,
			description: 'This items are not yet started',
			colorClass: 'bg-gray-500'
		},
		{
			id: TicketStatusesSchema.enum.ready,
			title: TicketStatusesSchema.enum.ready,
			description: 'This items are ready to be started',
			colorClass: 'bg-yellow-500'
		},
		{
			id: TicketStatusesSchema.enum.in_progress,
			title: TicketStatusesSchema.enum.in_progress,
			description: 'This items are in progress',
			colorClass: 'bg-blue-500'
		},
		{
			id: TicketStatusesSchema.enum.in_review,
			title: TicketStatusesSchema.enum.in_review,
			description: 'This items are in review',
			colorClass: 'bg-purple-500'
		},
		{
			id: TicketStatusesSchema.enum.done,
			title: TicketStatusesSchema.enum.done,
			description: 'This items has been done',
			colorClass: 'bg-green-500'
		}
	]);

	const priorityOrder = ['highest', 'high', 'medium', 'low', 'lowest'];

	let columns = $derived<BoardColumn[]>(
		baseColumns.map((column) => ({
			...column,
			items: tickets
				.filter((ticket) => {
					return ticket.status === column.title;
				})
				.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))
				.map((ticket) => ticket)
		}))
	);

	async function handleDrop(draggedTicket: Ticket, targetColumnId: string) {
		if (draggedTicket.status === targetColumnId) {
			return;
		}

		const newStatus = targetColumnId as TicketStatuses;
		await ticketsActions.changeTicketStatus(draggedTicket.id, newStatus);
	}
</script>

<section class={['flex h-full min-h-0 w-full flex-1 gap-2', className]}>
	{#each columns as column (column.id)}
		<div
			class="column flex h-full min-h-0 min-w-[200px] flex-1 shrink-0 flex-col gap-2 rounded-xs border border-gray-200 bg-gray-50"
		>
			<div class="flex flex-col gap-1 border-b border-gray-200 bg-white px-2 pt-3 pb-2">
				<div class="flex items-center gap-2">
					<div class={column.colorClass + ' size-3 rounded-full'}></div>
					<span class="text-sm font-medium">{transformText(column.title)}</span>
					<Badge variant="outline">{column.items.length}</Badge>
				</div>
				<p class="text-xs text-gray-500">{column.description}</p>
			</div>

			<div class="min-h-0 flex-1 px-1 pb-1">
				<div
					class="column-content drop-zone flex h-full flex-col gap-1 rounded-sm"
					use:droppable={{
						dropZoneId: column.id,
						onDrop: handleDrop
					}}
				>
					{#if loading}
						{@render loadingSkeleton()}
					{:else}
						{#each column.items as ticket (ticket.id)}
							<div
								class="card"
								use:draggable={{
									data: ticket
								}}
							>
								<TicketsCard {ticket} onClick={onTicketClick} />
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/each}
</section>

{#snippet loadingSkeleton()}
	<div class="flex h-full flex-col gap-2">
		<Skeleton class="h-20 w-full rounded-md" />
		<Skeleton class="h-20 w-full rounded-md" />
	</div>
{/snippet}

<style>
	.card {
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.card.dragging {
		opacity: 0.5;
	}

	.drop-zone {
		position: relative;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.drop-zone.drag-over {
		background-color: rgba(59, 130, 246, 0.1);
		border: 1px dashed rgba(59, 130, 246, 0.5);
		border-radius: 2px;
	}
</style>
