<script lang="ts" module>
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { DEFAULT_AVATAR } from '$lib/constants/avatar.constants';
	import type {
		GetNotifications,
		NotificationTicketUpdatedMetadata
	} from '$lib/models/notifications/notifications.type';
	import { MailIcon, MailOpenIcon, Ticket } from '@lucide/svelte';
	import ReadableDate from '../ReadableDate.svelte';
	import { allUsersMap } from '$lib/store/users.store';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { TICKETS_DETAILS } from '$lib/constants/routes.constants';
	import { getRoute } from '$lib/utils/routes.utils';
	import { goto } from '$app/navigation';
	import { notificationsActions } from '$lib/store/notifications.store';
	import UserAvatar from '../UserAvatar.svelte';

	export type Props = {
		notification?: GetNotifications;
		onClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	let { notification, onClick }: Props = $props();

	let notifMetadata = $derived(notification?.metadata as NotificationTicketUpdatedMetadata);

	let usersMap = $derived($allUsersMap);

	let updatedByUser = $derived(usersMap[notifMetadata.updated_by]);

	let updatedByUserFullName = $derived(`${updatedByUser?.firstname} ${updatedByUser?.lastname}`);

	let updatedByUserAvatar = $derived(updatedByUser?.avatar);

	function handleNotificationClick() {
		goto(getRoute(TICKETS_DETAILS, { id: notifMetadata.ticket_id }));
		onClick?.(notifMetadata.ticket_id);

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

				<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-100 p-2">
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
