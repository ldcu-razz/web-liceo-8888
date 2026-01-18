<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import TooltipProvider from '$lib/components/ui/tooltip/tooltip-provider.svelte';
	import {
		meSessionsPagination,
		meSessionsStore,
		meSessionsTotalCount,
		meSessionsLoading,
		meSessionsError,
		meActions
	} from '$lib/store/me.store';
	import { ChevronDownIcon, LoaderIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let meSessions = $derived($meSessionsStore);
	let pagination = $derived($meSessionsPagination);
	let totalCount = $derived($meSessionsTotalCount);
	let loading = $derived($meSessionsLoading);
	let error = $derived($meSessionsError);

	let disableShowMore = $derived(meSessions.length >= totalCount);
	let loadingShowMore = $state(false);

	onMount(() => {
		meActions.getSessions(pagination);
	});

	async function handleShowMoreSessions() {
		loadingShowMore = true;
		meSessionsPagination.update((prev) => ({ ...prev, size: prev.size + 15 }));
		await meActions.getSessions(pagination, true);
		loadingShowMore = false;
	}
</script>

<div class="w-full">
	<div class="flex justify-between">
		<h1 class="text-md text-2xl font-semibold">Sessions</h1>
	</div>
	{#if loading}
		<div class="flex h-full flex-col items-center justify-center gap-2">
			<Skeleton class="h-32 w-full rounded-md" />
			<Skeleton class="h-32 w-full rounded-md" />
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each meSessions as session}
				<div class="rounded-md border border-border p-2 flex justify-between">
					<div class="flex-1 flex items-center justify-between gap-3">
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger class="max-w-[50%]">
									<h2 class="truncate text-sm font-medium text-nowrap">{session.user_agent}</h2>
								</TooltipTrigger>
								<TooltipContent sideOffset={4} hideArrow={true}>
									{session.user_agent}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div class="ml-auto flex flex-wrap items-center gap-2">
							{#if session.is_revoked}
								{@render expiredBadge()}
							{:else}
								{@render activeBadge()}
							{/if}
							{@render expiredAtBadge(session.expiredAt)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if !loading}
		<div class="mt-4">
			<Button
				variant="outline"
				size="sm"
				onclick={handleShowMoreSessions}
				disabled={loadingShowMore || disableShowMore}
			>
				<ChevronDownIcon class="size-4" />
				<span class="font-semibold">Show more sessions</span>
				{#if loadingShowMore}
					<LoaderIcon class="size-4 animate-spin" />
				{/if}
			</Button>
		</div>
	{/if}
</div>

{#snippet expiredBadge()}
	<div class="shrink-0 rounded-md border border-amber-200 bg-amber-100 px-2 py-1">
		<span class="text-xs font-semibold text-amber-800">Revoked</span>
	</div>
{/snippet}

{#snippet activeBadge()}
	<div class="shrink-0 rounded-md border border-green-200 bg-green-100 px-2 py-1">
		<span class="text-xs font-semibold text-green-800">Active</span>
	</div>
{/snippet}

{#snippet createdAtBadge(date: string)}
	<div class="shrink-0 rounded-md border border-border bg-gray-50 px-2 py-1">
		<span class="text-xs font-semibold text-gray-800"
			>Created At: {new Date(date).toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			})}</span
		>
	</div>
{/snippet}

{#snippet expiredAtBadge(date: number)}
	<div class="shrink-0 rounded-md border border-border bg-gray-50 px-2 py-1">
		<span class="text-xs font-semibold text-gray-800"
			>Expired At: {new Date(date).toLocaleString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			})}</span
		>
	</div>
{/snippet}
