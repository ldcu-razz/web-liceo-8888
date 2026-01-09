<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { ArrowDownIcon, SearchIcon } from '@lucide/svelte';
	import TicketItem from './TicketItem.svelte';
	import { MEMBER_TICKETS_ID } from '$lib/constants';
	import { goto } from '$app/navigation';
	import {
		ticketsActions,
		ticketsLoading,
		ticketsPagination,
		ticketsStore,
		ticketsTotalCount
	} from '$lib/store/tickets.store';
	import { meStore } from '$lib/store/me.store';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { debounce } from '$lib/utils/reactive.utils';
	import Button from '$lib/components/ui/button/button.svelte';

	let searchQuery = $state('');

	let tickets = $derived($ticketsStore);

	let pagination = $derived($ticketsPagination);

	let totalCount = $derived($ticketsTotalCount);

	let loading = $derived($ticketsLoading);

	let isTicketsReachedMaxLimit = $derived(tickets.length >= totalCount);

	let me = $derived($meStore);

	$effect(() => {
		debouncedSearchQuery(searchQuery);
	});

	let debouncedSearchQuery = debounce((query: string) => {
		const isSilentLoader = tickets.length > 0;
		ticketsActions.getTickets(
			{ page: 1, size: 20 },
			query,
			undefined,
			undefined,
			[me?.id || ''],
			undefined,
			isSilentLoader
		);
	}, 500);

	function handleClickTicket(id: string) {
		goto(MEMBER_TICKETS_ID.replace('{id}', id));
	}

	function handleShowMoreTickets() {
		ticketsPagination.update((prev) => ({ ...prev, size: prev.size + 20 }));
		ticketsActions.getTickets(
			{ page: pagination.page, size: pagination.size },
			searchQuery,
			undefined,
			undefined,
			[me?.id || '']
		);
	}
</script>

<section>
	<div class="align-center mt-4 flex flex-col gap-3 px-4 pt-3">
		<h3 class="text-2xl font-semibold">Tickets</h3>
		<InputGroup class="bg-white py-5">
			<InputGroupAddon>
				<SearchIcon class="size-4" />
			</InputGroupAddon>
			<InputGroupInput bind:value={searchQuery} placeholder="Search ticket" />
		</InputGroup>
	</div>

	<div class="mt-4 flex flex-col">
		{#if loading}
			{@render loadingSkeleton()}
		{:else}
			{#each tickets as ticket, index}
				{@const isLastItem = index === tickets.length - 1}
				<TicketItem {ticket} {isLastItem} onClickTicket={handleClickTicket} />
			{:else}
				<div class="flex justify-center items-center h-full">
					<p class="text-gray-500">No tickets found</p>
				</div>
			{/each}
		{/if}

		{#if !loading && !isTicketsReachedMaxLimit}
			<div class="flex justify-center">
				<Button variant="outline" class="mt-4 w-fit" onclick={handleShowMoreTickets}>
					<ArrowDownIcon class="size-4" />
					Show More
				</Button>
			</div>
		{/if}
	</div>
</section>

{#snippet loadingSkeleton()}
	<div class="mx-4 flex flex-col gap-2">
		<Skeleton class="h-16 w-full rounded-md" />
		<Skeleton class="h-16 w-full rounded-md" />
	</div>
{/snippet}
