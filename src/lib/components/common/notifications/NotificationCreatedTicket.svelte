<script lang="ts" module>
	import type {
		GetNotifications,
		NotificationTicketCreatedMetadata
	} from '$lib/models/notifications/notifications.type';
	import { MailIcon, Ticket, HatGlasses } from '@lucide/svelte';
	import ReadableDate from '../ReadableDate.svelte';
	import { allUsersMap } from '$lib/store/users.store';
	import { notificationsActions } from '$lib/store/notifications.store';

	export type Props = {
		notification?: GetNotifications;
		onTicketClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	import { MailOpenIcon } from '@lucide/svelte';
	import UserAvatar from '../UserAvatar.svelte';

	let { notification, onTicketClick }: Props = $props();

	let notifMetadata = $derived(notification?.metadata as NotificationTicketCreatedMetadata);
	let usersMap = $derived($allUsersMap);

	let createdByUser = $derived(usersMap[notifMetadata.created_by]);
	let createdByUserFullName = $derived(`${createdByUser?.firstname} ${createdByUser?.lastname}`);
	let createdByUserAvatar = $derived(createdByUser?.avatar);

	let isAnonymous = $derived(!notifMetadata.created_by || notifMetadata.created_by === '');

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
			{#if isAnonymous}
				<div
					class="flex size-8 items-center justify-center rounded-full border-sky-300 bg-sky-100 text-sky-900"
				>
					<HatGlasses class="size-5" />
				</div>
			{:else}
				<UserAvatar name={createdByUserFullName} imageLink={createdByUserAvatar} sizeClass="size-8" />
			{/if}

			<div class="flex flex-1 flex-col gap-1">
				<div class="flex items-center gap-2 text-sm">
					<span>{@html notification?.metadata?.title ?? ''}</span>
				</div>
				<div class="text-xs text-gray-500">
					<ReadableDate date={new Date(notification?.createdAt ?? '')} />
				</div>

				<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-100 p-2 break-word">
					<div class="flex items-center gap-2">
						<Ticket class="size-4" />
						<span class="text-xs font-medium text-gray-600">
							{notification?.metadata?.code ?? ''}
						</span>
					</div>

					<div class="line-clamp-2 text-sm text-ellipsis">
						{@html notification?.metadata?.message ?? ''}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
