<script lang="ts" module>
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
		ScanEyeIcon
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

	let ticketStatusPulseMap = $derived({
		[TicketStatusesSchema.enum.backlog]: 'animate-pulse-gray',
		[TicketStatusesSchema.enum.closed]: 'animate-pulse-rose',
		[TicketStatusesSchema.enum.archived]: 'animate-pulse-red',
		[TicketStatusesSchema.enum.in_progress]: 'animate-pulse-blue',
		[TicketStatusesSchema.enum.done]: 'animate-pulse-green',
		[TicketStatusesSchema.enum.ready]: 'animate-pulse-yellow',
		[TicketStatusesSchema.enum.in_review]: 'animate-pulse-purple'
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
		{@const isCurrnetStatus = ticketStatus === status}
		<div class="relative flex gap-4">
			<div class="relative flex flex-col items-center">
				<div
					class={cn(
						'z-1 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-background',
						bgColor,
						isCurrnetStatus ? ticketStatusPulseMap[ticketStatus] : ''
					)}
				>
					{#if ticketStatus === TicketStatusesSchema.enum.backlog}
						<ImportIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.closed}
						<CircleXIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.archived}
						<ArchiveIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.in_progress}
						<CircleDotDashedIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.done}
						<BadgeCheckIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.ready}
						<CircleDotIcon class={cn('size-4', iconColor)} />
					{:else if ticketStatus === TicketStatusesSchema.enum.in_review}
						<ScanEyeIcon class={cn('size-4', iconColor)} />
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
						'm-0 text-sm',
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

<style>
	@keyframes pulse-gray {
		0%,
		100% {
			background-color: rgb(243 244 246);
		}
		50% {
			background-color: rgb(209 213 219);
		}
	}

	@keyframes pulse-rose {
		0%,
		100% {
			background-color: rgb(255 228 230);
		}
		50% {
			background-color: rgb(253 164 175);
		}
	}

	@keyframes pulse-red {
		0%,
		100% {
			background-color: rgb(254 226 226);
		}
		50% {
			background-color: rgb(252 165 165);
		}
	}

	@keyframes pulse-blue {
		0%,
		100% {
			background-color: rgb(219 234 254);
		}
		50% {
			background-color: rgb(147 197 253);
		}
	}

	@keyframes pulse-green {
		0%,
		100% {
			background-color: rgb(220 252 231);
		}
		50% {
			background-color: rgb(134 239 172);
		}
	}

	@keyframes pulse-yellow {
		0%,
		100% {
			background-color: rgb(254 249 195);
		}
		50% {
			background-color: rgb(253 224 71);
		}
	}

	@keyframes pulse-purple {
		0%,
		100% {
			background-color: rgb(243 232 255);
		}
		50% {
			background-color: rgb(216 180 254);
		}
	}

	:global(.animate-pulse-gray) {
		animation: pulse-gray 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-rose) {
		animation: pulse-rose 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-red) {
		animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-blue) {
		animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-green) {
		animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-yellow) {
		animation: pulse-yellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-pulse-purple) {
		animation: pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
