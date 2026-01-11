<script lang="ts">
	import { goto } from '$app/navigation';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { TICKETS_DETAILS } from '$lib/constants';
	import { getRoute } from '$lib/utils/routes.utils';
	import { onMount } from 'svelte';
	import CardStat from './CardStat.svelte';
	import RecentTicketDataTable from './RecentTicketDataTable.svelte';
	import TotalTicketsGraph from './TotalTicketsGraph.svelte';
	import { createColumns } from './columns';
	import {
		dashboardActions,
		dashboardRecentTicketsLoadingStore,
		dashboardRecentTicketsStore,
		dashboardStatsLoadingStore,
		dashboardStatsStore
	} from '$lib/store/dashboard.store';

	const columns = $derived(createColumns(onView));

	let stats = $derived($dashboardStatsStore);
	let statsLoading = $derived($dashboardStatsLoadingStore);

	let recentTickets = $derived($dashboardRecentTicketsStore);
	let recentTicketsLoading = $derived($dashboardRecentTicketsLoadingStore);

	onMount(async () => {
		dashboardActions.getDashboardStats();
		dashboardActions.getRecentTickets();
	});

	function onView(id: string) {
		goto(getRoute(TICKETS_DETAILS, { id }));
	}
</script>

<div class="flex flex-col gap-6 p-4">
	{#if statsLoading}
		{@render cardStatsLoading()}
	{:else}
		<div class="grid grid-cols-4 gap-4">
			<CardStat
				title="Total Tickets"
				value={stats?.total_tickets ?? 0}
				description="Total issue tickets created"
			/>
			<CardStat
				title="Total Resolved Tickets"
				value={stats?.total_resolved_tickets ?? 0}
				description="Total resolved tickets"
			/>
			<CardStat
				title="Active Accounts"
				value={stats?.total_active_accounts ?? 0}
				description="Total active accounts in the system"
			/>
			<CardStat
				title="Total Departments"
				value={stats?.total_active_departments ?? 0}
				description="Total active departments in the system"
			/>
		</div>
	{/if}

	<TotalTicketsGraph />

	<div class="mt-4 flex flex-col">
		<div class="mb-4 flex flex-col gap-1">
			<h2 class="text-lg font-medium">Recent Tickets</h2>
			<p class="text-sm text-gray-500">View the most recent tickets created in the system</p>
		</div>
		<RecentTicketDataTable {columns} data={recentTickets} loading={recentTicketsLoading} />
	</div>
</div>

{#snippet cardStatsLoading()}
	<div class="grid grid-cols-4 gap-4">
		<Skeleton class="h-32 w-full rounded-md" />
		<Skeleton class="h-32 w-full rounded-md" />
		<Skeleton class="h-32 w-full rounded-md" />
		<Skeleton class="h-32 w-full rounded-md" />
	</div>
{/snippet}
