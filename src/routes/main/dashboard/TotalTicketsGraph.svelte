<script lang="ts">
	import { scaleUtc } from 'd3-scale';
	import { Area, AreaChart, ChartClipPath } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import ChartContainer from '$lib/components/ui/chart/chart-container.svelte';
	import { cubicInOut } from 'svelte/easing';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import ChartTooltip from '$lib/components/ui/chart/chart-tooltip.svelte';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import type { ChartConfig } from '$lib/components/ui/chart';
	import { transformText } from '$lib/utils/texts.utils';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import {
		dashboardActions,
		totalTicketsGraphLoadingStore,
		totalTicketsGraphStore
	} from '$lib/store/dashboard.store';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { untrack } from 'svelte';

	let ticketStatus = TicketStatusesSchema.options;

	let ticketTotalGraphData = $derived($totalTicketsGraphStore);
	let data = $derived.by(() =>
		ticketTotalGraphData.map((item) => ({
			...item,
			date: new Date(item.date)
		}))
	);

	let loading = $derived($totalTicketsGraphLoadingStore);

	let filterOptions = $state([
		{ label: 'Last 7 days', value: '7d' },
		{ label: 'Last 30 days', value: '30d' },
		{ label: 'Last 3 months', value: '90d' },
		{ label: 'Last year', value: '365d' }
	]);

	let timeRange = $state(filterOptions[0].value);

	let selectedLabel = $derived.by(
		() => filterOptions.find((option) => option.value === timeRange)?.label
	);

	const chartConfig = {
		...Object.fromEntries(
			ticketStatus.map((status, index) => [
				status,
				{ label: transformText(status), color: `var(--chart-${index + 1})` }
			])
		)
	} satisfies ChartConfig;

	$effect(() => {
		const timeRangeValue = getDaysFromTimeRange(timeRange);
		untrack(() => {
			const today = new Date();
			const endDate = today.toISOString();
			const startDate = new Date(
				today.getTime() - timeRangeValue * 24 * 60 * 60 * 1000
			).toISOString();
			dashboardActions.getTotalTicketsGraph(startDate, endDate);
		});
	});

	function getDaysFromTimeRange(range: string): number {
		const days = parseInt(range.replace('d', ''));
		return days;
	}
</script>

<Card>
	<CardHeader class="flex items-center gap-2 space-y-0 border-b sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-start">
			<CardTitle>Total Tickets</CardTitle>
			<CardDescription>Show total ticket count by status over time</CardDescription>
		</div>
		<Select type="single" bind:value={timeRange}>
			<SelectTrigger class="w-40 rounded-lg sm:ms-auto" aria-label="Select a value">
				{selectedLabel}
			</SelectTrigger>
			<SelectContent class="rounded-xl">
				{#each filterOptions as option}
					<SelectItem value={option.value} class="rounded-lg">
						{option.label}
					</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</CardHeader>
	<CardContent>
		{#if !loading}
			<ChartContainer config={chartConfig} class="-ml-3 aspect-auto h-[350px] w-full">
				<AreaChart
					legend
					{data}
					x="date"
					xScale={scaleUtc()}
					series={[
						...ticketStatus.map((status) => ({
							key: status,
							label: status,
							color: chartConfig[status].color
						}))
					]}
					seriesLayout="stack"
					props={{
						area: {
							curve: curveNatural,
							'fill-opacity': 0.4,
							line: { class: 'stroke-1' },
							motion: 'tween'
						},
						xAxis: {
							ticks: timeRange === '7d' ? 7 : undefined,
							format: (v) => {
								return v.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric'
								});
							}
						},

						yAxis: {
							format: (v) => v.toLocaleString()
						}
					}}
				>
					{#snippet marks({ series, getAreaProps })}
						<defs>
							{#each ticketStatus as status}
								<linearGradient id={`fill${status}`} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stop-color={chartConfig[status].color} stop-opacity={1.0} />
									<stop offset="95%" stop-color={chartConfig[status].color} stop-opacity={0.1} />
								</linearGradient>
							{/each}
						</defs>
						<ChartClipPath
							initialWidth={0}
							motion={{
								width: { type: 'tween', duration: 1000, easing: cubicInOut }
							}}
						>
							{#each series as s, i (s.key)}
								<Area {...getAreaProps(s, i)} fill={`url(#fill${s.key})`} />
							{/each}
						</ChartClipPath>
					{/snippet}
					{#snippet tooltip()}
						<ChartTooltip
							labelFormatter={(v: Date) => {
								return v.toLocaleDateString('en-US', {
									month: 'long'
								});
							}}
							indicator="line"
						/>
					{/snippet}
				</AreaChart>
			</ChartContainer>
		{:else}
			<Skeleton class="h-[350px] w-full" />
		{/if}
	</CardContent>
</Card>
