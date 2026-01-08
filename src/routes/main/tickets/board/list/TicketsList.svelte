<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import type { GetTicket, Ticket } from '$lib/models/tickets/tickets.type';
	import { ChevronDownIcon } from '@lucide/svelte';
	import TicketsListItem from './TicketsListItem.svelte';

	type Props = {
		tickets: GetTicket[];
		onTicketClick?: (ticket: GetTicket) => void;
	};
</script>

<script lang="ts">
	let { tickets, onTicketClick }: Props = $props();

	let emptyData = $derived(tickets.length === 0);
</script>

<div class="flex flex-col gap-2">
	{#if emptyData}
		<div class="flex flex-col items-center justify-center gap-2">
			<p class="text-sm text-gray-500">No tickets to show</p>
		</div>
	{:else}
		{#each tickets as ticket (ticket.id)}
			<TicketsListItem {ticket} onClick={onTicketClick} />
		{/each}
	{/if}
</div>
