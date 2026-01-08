<script lang="ts">
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { meStore } from '$lib/store/me.store';
	import { BellDotIcon, BellIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let { sidebarTrigger }: { sidebarTrigger?: Snippet } = $props();

	let me = $derived($meStore);
	let meInitial = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);
	let meAvatar = $derived(me?.avatar ?? '');
</script>

<div class="flex items-center justify-between border-b border-border p-2">
	<div class="flex w-full items-center justify-between gap-2">
		{#if sidebarTrigger}
			{@render sidebarTrigger()}
		{/if}

		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon">
				<BellIcon class="size-5" />
			</Button>
			<UserAvatar name={meInitial} imageLink={meAvatar} sizeClass="size-6" />
		</div>
	</div>
</div>
