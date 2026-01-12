<script lang="ts" module>
	import type {
		GetNotifications,
		NotificationAccountCreatedMetadata
	} from '$lib/models/notifications/notifications.type';
	import { MailIcon, Ticket } from '@lucide/svelte';
	import ReadableDate from '../ReadableDate.svelte';
	import { notificationsActions } from '$lib/store/notifications.store';

	export type Props = {
		notification?: GetNotifications;
		onUserClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	import { MailOpenIcon } from '@lucide/svelte';
	import UserAvatar from '../UserAvatar.svelte';

	let { notification, onUserClick }: Props = $props();

	let notifMetadata = $derived(notification?.metadata as NotificationAccountCreatedMetadata);

	let fullname = $derived(notifMetadata.fullname ?? 'Unknown User');

	function handleNotificationClick() {
		onUserClick?.(notifMetadata.user_id);

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
			<UserAvatar name={fullname} sizeClass="size-8" />
			<div class="flex flex-1 flex-col gap-1">
				<div class="flex items-center gap-2 text-sm">
					<span>{@html notification?.metadata?.title ?? ''}</span>
				</div>
				<div class="text-xs text-gray-500">
					<ReadableDate date={new Date(notification?.createdAt ?? '')} />
				</div>

				<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-100 p-2">
					<div class="line-clamp-2 text-sm text-ellipsis">
						{@html notification?.metadata?.message ?? ''}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
