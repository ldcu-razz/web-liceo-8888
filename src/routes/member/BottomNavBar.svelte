<script lang="ts" module>
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import {
		MEMBER_NOTIFICATIONS,
		MEMBER_PROFILE,
		MEMBER_TICKETS
	} from '$lib/constants/routes.constants';
	import { notificationsUnreadCountStore } from '$lib/store/notifications.store';

	type Props = {
		createTicket?: () => void;
	};
</script>

<script lang="ts">
	let { createTicket }: Props = $props();

	import { BellIcon, CirclePlusIcon, TicketIcon, UserCog } from '@lucide/svelte';

	let isActiveTickets = $derived(page.url.pathname.includes(MEMBER_TICKETS));
	let isActiveProfile = $derived(page.url.pathname.includes(MEMBER_PROFILE));
	let isActiveNotifications = $derived(page.url.pathname.includes(MEMBER_NOTIFICATIONS));

	let unreadNotificationsCount = $derived($notificationsUnreadCountStore);

	function handleCreateTicket() {
		createTicket?.();
	}
</script>

<div class="fixed right-0 bottom-4 left-0 mx-auto flex w-full max-w-[560px] justify-center">
	<div class="flex justify-center rounded-full bg-slate-950 px-3 py-2.5">
		<div class="align-center flex gap-3">
			<a
				href={MEMBER_TICKETS}
				class="flex items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950 {isActiveTickets
					? 'bg-white text-slate-950!'
					: ''}"
			>
				<TicketIcon class="size-5" />
				<span class="text-xs">Tickets</span>
			</a>
			<div
				class="flex cursor-pointer items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950"
				role="button"
				tabindex="0"
				onclick={handleCreateTicket}
				onkeydown={handleCreateTicket}
			>
				<CirclePlusIcon class="size-5" />
				<span class="text-xs">Create Ticket</span>
			</div>
			<a
				href={MEMBER_PROFILE}
				class="flex items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950 {isActiveProfile
					? 'bg-white text-slate-950!'
					: ''}"
			>
				<UserCog class="size-5" />
				<span class="text-xs">Profile</span>
			</a>
			<a
				href={MEMBER_NOTIFICATIONS}
				class="flex items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950 {isActiveNotifications
					? 'bg-white text-slate-950!'
					: ''}"
			>
				<BellIcon class="size-5" />
				{#if unreadNotificationsCount > 0}
					<Badge variant="destructive" class="size-4">{unreadNotificationsCount}</Badge>
				{/if}
				<span class="text-xs">Notifications</span>
			</a>
		</div>
	</div>
</div>
