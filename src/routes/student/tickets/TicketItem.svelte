<script lang="ts" module>
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { renderComponent } from '$lib/components/ui/data-table/render-helpers';
	import { DEFAULT_AVATAR } from '$lib/constants/avatar.constants';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { GetTicket, TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { transformText } from '$lib/utils/texts.utils';
	import { TicketCheckIcon, TicketMinusIcon, TicketXIcon } from '@lucide/svelte';
	import TicketIcon from '../TicketIcon.svelte';

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

	let ticketStatusColorMap = $derived({
		[TicketStatusesSchema.enum.backlog]: 'text-gray-400',
		[TicketStatusesSchema.enum.closed]: 'text-green-400',
		[TicketStatusesSchema.enum.archived]: 'text-red-400',
		[TicketStatusesSchema.enum.in_progress]: 'text-blue-400',
		[TicketStatusesSchema.enum.done]: 'text-yellow-400',
		[TicketStatusesSchema.enum.ready]: 'text-yellow-400',
		[TicketStatusesSchema.enum.in_review]: 'text-purple-400'
	});

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
		<TicketIcon status={ticket?.status as TicketStatuses} classSize="size-4" />

		<div class="mt-0.5 flex flex-col gap-1">
			<p class="text-sm text-gray-500">{ticket?.code}</p>
			<h3 class="line-clamp-1 text-lg font-medium text-ellipsis">{ticket?.title}</h3>

			<div class="mt-2 flex items-center gap-2">
				{#if ticket?.status}
					<div
						class="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium"
					>
						<div class="size-1.5 rounded-full bg-gray-400"></div>
						<span class="text-gray-500">{transformText(ticket?.status ?? '')}</span>
					</div>
				{/if}
				{#if ticket?.priority}
					<div
						class="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium"
					>
						<div class="size-1.5 rounded-full bg-yellow-400"></div>
						<span class="text-gray-500">{transformText(ticket?.priority ?? '')}</span>
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
