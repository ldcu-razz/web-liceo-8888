<script lang="ts">
	import { goto } from '$app/navigation';
	import { TICKETS_DETAILS, USER_DETAILS } from '$lib';
	import NotificaionItem from '$lib/components/common/notifications/NotificaionItem.svelte';
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SheetContent, SheetHeader, SheetTitle } from '$lib/components/ui/sheet';
	import Sheet from '$lib/components/ui/sheet/sheet.svelte';
	import { meStore } from '$lib/store/me.store';
	import {
		notificationsActions,
		notificationsCountStore,
		notificationsLoadingStore,
		notificationsPaginationStore,
		notificationsStore,
		notificationsUnreadCountStore
	} from '$lib/store/notifications.store';
	import { getRoute } from '$lib/utils/routes.utils';
	import { BellIcon, ChevronDownIcon } from '@lucide/svelte';
	import { onMount, type Snippet } from 'svelte';

	let { sidebarTrigger }: { sidebarTrigger?: Snippet } = $props();

	let me = $derived($meStore);
	let meInitial = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);
	let meAvatar = $derived(me?.avatar ?? '');

	let openNotificationsSheet = $state(false);

	let loadingNotifications = $derived($notificationsLoadingStore);

	let pagination = $derived($notificationsPaginationStore);

	let notificationsCount = $derived($notificationsCountStore);

	let unreadNotificationsCount = $derived($notificationsUnreadCountStore);

	let unreadNotificationsCountLabel = $derived(unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount);

	let isReachedToMaxNotificationsLimit = $derived(pagination.size >= notificationsCount);

	let notification = $derived($notificationsStore);

	let isEmptyNotifications = $derived(notification.length === 0);

	function handleOpenNotificationsSheet() {
		openNotificationsSheet = true;
	}

	function handleOnTicketNotificationClick(id: string) {
		goto(getRoute(TICKETS_DETAILS, { id }));
		openNotificationsSheet = false;
	}

	function handleOnUserNotificationClick(id: string) {
		goto(getRoute(USER_DETAILS, { id }));
		openNotificationsSheet = false;
	}

	function handleShowMoreNotifications() {
		if (isReachedToMaxNotificationsLimit) {
			return;
		}
		notificationsPaginationStore.update((prev) => ({ ...prev, size: prev.size + 15 }));
		notificationsActions.getNotifications(
			{ page: pagination.page, size: pagination.size + 15 },
			me?.id ?? ''
		);
	}

	onMount(async () => {
		await notificationsActions.getNotifications(
			{ page: pagination.page, size: pagination.size },
			me?.id ?? ''
		);
	});
</script>

<div class="flex items-center justify-between border-b border-border p-2">
	<div class="flex w-full items-center justify-between gap-2">
		{#if sidebarTrigger}
			{@render sidebarTrigger()}
		{/if}

		<div class="flex items-center gap-2">
			<div class="relative">
				<Button variant="ghost" size="sm" onclick={handleOpenNotificationsSheet}>
					{#if unreadNotificationsCount > 0}
						<Badge variant="destructive" class="py-1 px-1.5 text-[10px]">{unreadNotificationsCountLabel}</Badge>
					{/if}
					<BellIcon class="size-5" />
				</Button>
			</div>
			<UserAvatar name={meInitial} imageLink={meAvatar} sizeClass="size-6" />
		</div>
	</div>
</div>

<Sheet bind:open={openNotificationsSheet}>
	<SheetContent class="my-4 mr-4 max-h-[calc(100vh-2rem)] gap-0 rounded-lg sm:max-w-md">
		<SheetHeader class="border-b border-border pb-4">
			<SheetTitle>Notifications</SheetTitle>
		</SheetHeader>
		<div class="flex flex-col overflow-y-auto pb-13">
			{#if loadingNotifications}
				Loading
			{:else if isEmptyNotifications}
				<div class="mt-4 flex h-full items-center justify-center">
					<p class="text-sm text-gray-500">No notifications</p>
				</div>
			{:else}
				{#each notification as notification}
					<div class={'border-b'}>
						<NotificaionItem
							{notification}
							onTicketClick={handleOnTicketNotificationClick}
							onUserClick={handleOnUserNotificationClick}
						/>
					</div>

					<div
						class="absolute right-0 bottom-0 left-0 flex justify-center rounded-b-lg border-t bg-white py-2"
					>
						{#if !isReachedToMaxNotificationsLimit}
							<Button variant="ghost" size="sm" onclick={handleShowMoreNotifications}>
								<ChevronDownIcon class="size-4" />
								Show more
							</Button>
						{:else}
							<p class="py-2 text-sm text-gray-500">No more notifications</p>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</SheetContent>
</Sheet>
