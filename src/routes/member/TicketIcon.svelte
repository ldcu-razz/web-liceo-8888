<script lang="ts" module>
	import { renderComponent } from '$lib/components/ui/data-table';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { TicketCheckIcon, TicketIcon, TicketMinusIcon, TicketXIcon } from '@lucide/svelte';

	export type Props = {
		status: TicketStatuses;
		classSize?: string;
	};
</script>

<script lang="ts">
	let { status, classSize = 'size-1' }: Props = $props();

	let icon = $derived.by(() => {
		if (status === TicketStatusesSchema.enum.backlog) {
			return renderComponent(TicketMinusIcon);
		}

		if (
			status === TicketStatusesSchema.enum.closed ||
			status === TicketStatusesSchema.enum.archived
		) {
			return renderComponent(TicketXIcon);
		}

		return renderComponent(TicketCheckIcon);
	});

	let ticketStatusColorMap = $derived({
		[TicketStatusesSchema.enum.backlog]: 'text-gray-400',
		[TicketStatusesSchema.enum.closed]: 'text-green-400',
		[TicketStatusesSchema.enum.archived]: 'text-red-400',
		[TicketStatusesSchema.enum.in_progress]: 'text-blue-400',
		[TicketStatusesSchema.enum.done]: 'text-yellow-400',
		[TicketStatusesSchema.enum.ready]: 'text-yellow-400',
		[TicketStatusesSchema.enum.in_review]: 'text-purple-400'
	});
</script>

<icon.component class={`${status ? ticketStatusColorMap[status] : ''} ${classSize}`} />
