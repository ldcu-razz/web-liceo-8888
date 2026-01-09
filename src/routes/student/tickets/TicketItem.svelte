<script lang="ts" module>
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { renderComponent } from '$lib/components/ui/data-table/render-helpers';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type {
		GetTicket,
		TicketsPriorities,
		TicketStatuses
	} from '$lib/models/tickets/tickets.type';
	import { transformText } from '$lib/utils/texts.utils';
	import { TicketCheckIcon, TicketMinusIcon, TicketXIcon } from '@lucide/svelte';
	import TicketIcon from '../TicketIcon.svelte';
	import {
		TICKET_PRIORITY_COLOR_MAP,
		TICKET_STATUS_COLOR_MAP
	} from '$lib/constants/ticket.constants';

	export type Props = {
		ticket?: GetTicket;
		isLastItem?: boolean;
		onClickTicket?: (id: string) => void;
	};
</script>

<script lang="ts">
	let { ticket, isLastItem, onClickTicket }: Props = $props();

	let icon = $derived.by(() => {
		const ticketStatus = ticket?.status;
		if (ticketStatus === TicketStatusesSchema.enum.backlog) {
			return renderComponent(TicketMinusIcon, { class: 'size-4' });
		}

		if (
			ticketStatus === TicketStatusesSchema.enum.closed ||
			ticketStatus === TicketStatusesSchema.enum.archived
		) {
			return renderComponent(TicketXIcon, { class: 'size-4' });
		}

		return renderComponent(TicketCheckIcon, { class: 'size-4' });
	});

	let reportedBy = $derived(ticket?.reported_by);

	let reportedByInitial = $derived(
		reportedBy
			? reportedBy?.firstname.slice(0, 1).toUpperCase() +
					reportedBy?.lastname.slice(0, 1).toUpperCase()
			: 'AU'
	);

	let reportedByAvatar = $derived(reportedBy?.avatar);

	let ticketStatusColorMap = $derived(TICKET_STATUS_COLOR_MAP);

	let ticketPriorityColorMap = $derived(TICKET_PRIORITY_COLOR_MAP);

	function handleClickTicket() {
		onClickTicket?.(ticket?.id ?? '');
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onClickTicket?.(ticket?.id ?? '');
		}
	}
</script>

<div
	class="flex cursor-pointer flex-col gap-2 border-t bg-white px-4 py-4 transition-colors duration-300 hover:bg-gray-50 {isLastItem
		? 'border-b'
		: ''}"
	role="button"
	tabindex="0"
	onclick={handleClickTicket}
	onkeydown={handleKeyDown}
>
	<div class="flex gap-3">
		<div class="mt-0.5">
			<TicketIcon status={ticket?.status as TicketStatuses} classSize="size-4" />
		</div>

		<div class="flex flex-col gap-1">
			<p class="text-sm text-gray-500">{ticket?.code}</p>
			<h3 class="line-clamp-1 text-lg font-medium text-ellipsis">{ticket?.title}</h3>

			<div class="mt-2 flex items-center gap-2">
				{#if ticket?.status}
					{@const ticketStatusColor = ticketStatusColorMap[ticket?.status as TicketStatuses]}
					<div
						class="flex items-center gap-2 rounded-full border {ticketStatusColor.borderColor} px-2 py-0.5 text-[10px] font-medium"
					>
						<div class="size-1.5 rounded-full {ticketStatusColor.bgColor}"></div>
						<span class={ticketStatusColor.textColor}>{transformText(ticket?.status ?? '')}</span>
					</div>
				{/if}
				{#if ticket?.priority}
					{@const ticketPriorityColor =
						ticketPriorityColorMap[ticket?.priority as TicketsPriorities]}
					<div
						class="flex items-center gap-2 rounded-full border {ticketPriorityColor.borderColor} px-2 py-0.5 text-[10px] font-medium"
					>
						<div class="size-1.5 rounded-full {ticketPriorityColor.bgColor}"></div>
						<span class={ticketPriorityColor.textColor}
							>{transformText(ticket?.priority ?? '')}</span
						>
					</div>
				{/if}
			</div>
		</div>

		<div class="ml-auto">
			<Avatar class="size-8">
				<AvatarImage src={reportedByAvatar} />
				<AvatarFallback class="text-sm font-semibold">{reportedByInitial}</AvatarFallback>
			</Avatar>
		</div>
	</div>
</div>
