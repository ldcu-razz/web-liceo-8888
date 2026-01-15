<script lang="ts" module>
	import type {
		GetNotifications,
		NotificationTicketUpdatedMetadata
	} from '$lib/models/notifications/notifications.type';
	import { MailIcon, MailOpenIcon, Ticket } from '@lucide/svelte';
	import ReadableDate from '../ReadableDate.svelte';
	import { allUsersMap } from '$lib/store/users.store';
	import { notificationsActions } from '$lib/store/notifications.store';
	import UserAvatar from '../UserAvatar.svelte';

	export type Props = {
		notification?: GetNotifications;
		onTicketClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	let { notification, onTicketClick }: Props = $props();

	let notifMetadata = $derived(notification?.metadata as NotificationTicketUpdatedMetadata);

	let usersMap = $derived($allUsersMap);

	let updatedByUser = $derived(usersMap[notifMetadata.updated_by]);

	let updatedByUserFullName = $derived(`${updatedByUser?.firstname} ${updatedByUser?.lastname}`);

	let updatedByUserAvatar = $derived(updatedByUser?.avatar);

	function handleNotificationClick() {
		onTicketClick?.(notifMetadata.ticket_id);

		if (!notification?.mark_as_read) {
			makeTicketRead();
		}
	}

	function makeTicketRead() {
		notificationsActions.markAsRead(notification?.id ?? '');
	}
</script>

<div
	class="relative flex flex-col gap-2"
	role="button"
	tabindex="0"
	onclick={handleNotificationClick}
	onkeydown={handleNotificationClick}
>
	{#if notification?.mark_as_read}
		<MailOpenIcon class="absolute top-1 right-2 size-4 text-gray-500" />
	{:else}
		<MailIcon class="absolute top-1 right-2 size-4 text-blue-500" />
	{/if}
	<div class="flex items-center justify-between">
		<div class="center flex flex-1 gap-4">
			<UserAvatar name={updatedByUserFullName} imageLink={updatedByUserAvatar} sizeClass="size-8" />
			<div class="flex flex-1 flex-col gap-1">
				<div class="flex items-center gap-2 text-sm">
					<span class="font-medium">{notification?.metadata?.title}</span>
				</div>
				<div class="text-xs text-gray-500">
					<ReadableDate date={new Date(notification?.createdAt ?? '')} />
				</div>

				<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-100 p-2" style="word-break: break-all;">
					<div class="flex items-center gap-2">
						<Ticket class="size-4" />
						<span class="text-xs font-medium text-gray-600"
							>{notification?.metadata?.code ?? ''}</span
						>
					</div>

					<div class="flex items-center gap-2 text-sm">
						{@html notification?.metadata?.message ?? ''}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
