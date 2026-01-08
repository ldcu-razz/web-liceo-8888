<script lang="ts" module>
	export type Props = {
		ticketId: string;
	};
</script>

<script lang="ts">
	import {
		ticketsUpdatesActiveTicketIdStore,
		ticketsUpdatesStore,
		ticketUpdatesActions,
		ticketUpdatesLoadingStore
	} from '$lib/store/ticket-updates.store';
	import { cn } from '$lib/utils';
	import { Loader } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { ticketId }: Props = $props();

	let ticketUpdates = $derived($ticketsUpdatesStore);
	let activeTicketId = $derived($ticketsUpdatesActiveTicketIdStore);
	let ticketUpdatesLoading = $derived($ticketUpdatesLoadingStore);
	let isActiveTicket = $derived(activeTicketId === ticketId);
	let isEmpty = $derived(ticketUpdates.length === 0);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;

		return `${month} ${day} ${year} - ${hours}:${minutes} ${ampm}`;
	}

	onMount(() => {
		if (!isActiveTicket) {
			ticketUpdatesActions.getTicketsUpdates(ticketId, { page: 1, size: 20 });
		}
	});
</script>

{#if ticketUpdatesLoading}
	<div class="flex h-full items-center justify-center">
		<Loader class="size-4 animate-spin" />
		<span class="ml-2 text-sm text-gray-500">Loading...</span>
	</div>
{:else if !isEmpty}
	<div class="flex flex-col p-1">
		{#each ticketUpdates as update, index (update.id)}
			{@const isFirst = index === 0}
			<div class="relative flex gap-4">
				<div class="relative flex flex-col items-center">
					<div
						class={cn('z-1 mt-0.5 size-3 shrink-0 rounded-full border-background bg-gray-200', {
							'pulse-blue-shadow bg-blue-400': isFirst
						})}
					></div>
					{#if index < ticketUpdates.length - 1}
						<div class="absolute top-3 left-1.25 h-full min-h-8 w-0.5 flex-1 bg-border"></div>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-1 pb-6">
					<h3 class="m-0 text-xs font-semibold text-foreground">{update.title}</h3>
					<p class="m-0 text-xs text-gray-700">{@html update.message}</p>
					<span class="mt-1 text-xs text-muted-foreground">{formatDate(update.updated_at)}</span>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex h-full items-center justify-center">
		<span class="text-sm text-gray-500">No history found</span>
	</div>
{/if}

<style>
	.pulse-blue-shadow {
		animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-blue {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(96, 165, 250, 0);
		}
	}
</style>
