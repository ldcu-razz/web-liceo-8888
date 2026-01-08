<script lang="ts" module>
	import { renderComponent } from '$lib/components/ui/data-table';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { TicketStatuses } from '$lib/models/tickets/tickets.type';
	import { cn } from '$lib/utils';
	import { transformText } from '$lib/utils/texts.utils';
	import {
		ArchiveIcon,
		BadgeCheckIcon,
		CheckIcon,
		CircleDotDashedIcon,
		CircleDotIcon,
		CircleXIcon,
		ImportIcon,
		ScanEyeIcon,
		TicketCheckIcon,
		TicketMinusIcon,
		TicketXIcon
	} from '@lucide/svelte';

	export type Props = {
		status: TicketStatuses;
	};
</script>

<script lang="ts">
	let { status }: Props = $props();

	let ticketStatuses = $state<TicketStatuses[]>(TicketStatusesSchema.options);

	let ticketStatusColorMap = $derived({
		[TicketStatusesSchema.enum.backlog]: 'text-gray-700',
		[TicketStatusesSchema.enum.closed]: 'text-rose-700',
		[TicketStatusesSchema.enum.archived]: 'text-red-700',
		[TicketStatusesSchema.enum.in_progress]: 'text-blue-700',
		[TicketStatusesSchema.enum.done]: 'text-green-700',
		[TicketStatusesSchema.enum.ready]: 'text-yellow-700',
		[TicketStatusesSchema.enum.in_review]: 'text-purple-700'
	});

	let ticketStatusBgColorMap = $derived({
		[TicketStatusesSchema.enum.backlog]: 'bg-gray-100',
		[TicketStatusesSchema.enum.closed]: 'bg-rose-100',
		[TicketStatusesSchema.enum.archived]: 'bg-red-100',
		[TicketStatusesSchema.enum.in_progress]: 'bg-blue-100',
		[TicketStatusesSchema.enum.done]: 'bg-green-100',
		[TicketStatusesSchema.enum.ready]: 'bg-yellow-100',
		[TicketStatusesSchema.enum.in_review]: 'bg-purple-100'
	});

	let currentStatusIndex = $derived(ticketStatuses.indexOf(status));

	function isStatusActive(ticketStatus: TicketStatuses) {
		const statusIndex = ticketStatuses.indexOf(ticketStatus);
		return statusIndex <= currentStatusIndex;
	}
</script>

<div class="flex flex-col p-1">
	{#each ticketStatuses as ticketStatus, index (ticketStatus)}
		{@const isActive = isStatusActive(ticketStatus)}
		{@const iconColor = isActive ? ticketStatusColorMap[ticketStatus] : 'text-gray-400'}
		{@const bgColor = isActive ? ticketStatusBgColorMap[ticketStatus] : 'bg-gray-100'}
		<div class="relative flex gap-4">
			<div class="relative flex flex-col items-center">
				<div
					class={cn(
						'z-1 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-background',
						bgColor
					)}
				>
					{#if ticketStatus === TicketStatusesSchema.enum.backlog}
						<ImportIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.closed}
						<CircleXIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.archived}
						<ArchiveIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.in_progress}
						<CircleDotDashedIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.done}
						<BadgeCheckIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.ready}
						<CircleDotIcon class={cn('size-3', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.in_review}
						<ScanEyeIcon class={cn('size-3', iconColor)} />
					{/if}
				</div>
				{#if index < ticketStatuses.length - 1}
					<div
						class={cn(
							'left-2.325 absolute top-3 h-full min-h-8 w-0.25 flex-1',
							isActive ? 'bg-gray-300' : 'bg-gray-200'
						)}
					></div>
				{/if}
			</div>
			<div class="mt-1 flex flex-1 items-center justify-between gap-1 pb-6">
				<h3
					class={cn(
						'm-0 text-xs',
						isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
					)}
				>
					{transformText(ticketStatus)}
				</h3>
				{#if isActive}
					<CheckIcon class="size-4 text-green-700" />
				{/if}
			</div>
		</div>
	{/each}
</div>
