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

	let unreadNotificationsCountLabel = $derived(unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount);

	function handleCreateTicket() {
		createTicket?.();
	}
</script>

<div class="fixed right-0 bottom-4 left-0 z-10 mx-auto flex w-full max-w-[560px] justify-center">
	<div class="flex justify-center rounded-xl bg-primary px-2 py-2">
		<div class="align-center flex gap-1">
			<a
				href={MEMBER_TICKETS}
				class="flex items-center gap-2 rounded-md p-2 text-white hover:bg-secondary hover:text-white {isActiveTickets
					? 'bg-secondary text-white!'
					: ''}"
			>
				<TicketIcon class="size-5" />
				<span class="text-[10px]">Tickets</span>
			</a>
			<div
				class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white hover:bg-secondary hover:text-white"
				role="button"
				tabindex="0"
				onclick={handleCreateTicket}
				onkeydown={handleCreateTicket}
			>
				<CirclePlusIcon class="size-5" />
				<span class="text-[10px]">Create Ticket</span>
			</div>
			<a
				href={MEMBER_NOTIFICATIONS}
				class="flex items-center gap-2 rounded-md p-2 text-white hover:bg-secondary hover:text-white {isActiveNotifications
					? 'bg-secondary text-white!'
					: ''}"
			>
				<BellIcon class="size-5" />
				{#if unreadNotificationsCount > 0}
					<Badge variant="destructive" class="p-0.5 text-[8px]">{unreadNotificationsCountLabel}</Badge>
				{/if}
				<span class="text-[10px]">Notifications</span>
			</a>
			<a
				href={MEMBER_PROFILE}
				class="flex items-center gap-2 rounded-md p-2 text-white hover:bg-secondary hover:text-white {isActiveProfile
					? 'bg-secondary text-white!'
					: ''}"
			>
				<UserCog class="size-5" />
				<span class="text-[10px]">Profile</span>
			</a>
		</div>
	</div>
</div>
