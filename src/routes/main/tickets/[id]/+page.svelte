<script lang="ts">
	import { onMount } from 'svelte';
	import TicketsDetails from '../board/TicketsDetails.svelte';
	import { currentTicket, currentTicketLoading, ticketsActions } from '$lib/store/tickets.store';
	import { page } from '$app/state';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { TICKETS_BOARD } from '$lib/constants';
	import { goto } from '$app/navigation';
	import { meStore } from '$lib/store/me.store';
	import { UserRolesEnumSchema } from '$lib/models/users/users.schema';

	let ticket = $derived($currentTicket);

	let loading = $derived($currentTicketLoading);

	let me = $derived($meStore);
	let isMeRoleDepartmentStaff = $derived(me?.role === UserRolesEnumSchema.enum.department_staff);

	let disabledDeleteTicketButton = $derived(
		me?.role === UserRolesEnumSchema.enum.department_staff ||
			me?.role === UserRolesEnumSchema.enum.user
	);

	onMount(async () => {
		if (!page.params.id) return;
		await ticketsActions.getTicket(page.params.id);
	});

	function goBackToTickets() {
		goto(TICKETS_BOARD);
	}
</script>

<div class="mx-auto max-w-6xl">
	{#if loading}
		<div class="flex flex-col gap-2">
			<Skeleton class="h-32 w-full rounded-md" />
			<Skeleton class="h-24 w-full rounded-md" />
		</div>
	{:else}
		<div class="mb-6">
			<Button variant="link" size="sm" class="p-0! text-gray-700" onclick={goBackToTickets}>
				<ArrowLeftIcon class="size-4" />
				Go back to tickets
			</Button>
		</div>
		{#if ticket}
			<TicketsDetails
				{ticket}
				{disabledDeleteTicketButton}
				hideCloseButton={true}
				hideShareButton={true}
				close={() => {}}
			/>
		{:else}
			<div class="flex h-full items-center justify-center">No ticket found</div>
		{/if}
	{/if}
</div>
