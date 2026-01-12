<script lang="ts" module>
	import NotificationAssignedUserTicket from './NotificationAssignedUserTicket.svelte';
	import NotificationAssignedDepartmentTicket from './NotificationAssignedDepartmentTicket.svelte';
	import NotificationCommentedTicket from './NotificationCommentedTicket.svelte';
	import NotificationCreatedTicket from './NotificationCreatedTicket.svelte';
	import NotificationUpdateTicket from './NotificationUpdateTicket.svelte';
	import { type GetNotifications } from '$lib/models/notifications/notifications.type';
	import { NotificationsTypesSchema } from '$lib/models/notifications/notifications.schema';
	import NotificationNewAccountCreated from './NotificationNewAccountCreated.svelte';

	type Props = {
		notification: GetNotifications;
		onTicketClick?: (id: string) => void;
		onUserClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	let { notification, onTicketClick, onUserClick }: Props = $props();

	let notificationType = $derived(notification.type);

	function handleOnTicketNotificationClick(id: string) {
		onTicketClick?.(id);
	}

	function handleOnUserNotificationClick(id: string) {
		onUserClick?.(id);
	}
</script>

<div class="flex flex-col p-4 hover:bg-gray-200">
	{#if notificationType === NotificationsTypesSchema.enum.ticket_created}
		<NotificationCreatedTicket {notification} onTicketClick={handleOnTicketNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_updated}
		<NotificationUpdateTicket {notification} onTicketClick={handleOnTicketNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_commented}
		<NotificationCommentedTicket {notification} onTicketClick={handleOnTicketNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_department_assigned}
		<NotificationAssignedDepartmentTicket
			{notification}
			onTicketClick={handleOnTicketNotificationClick}
		/>
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_user_assigned}
		<NotificationAssignedUserTicket
			{notification}
			onTicketClick={handleOnTicketNotificationClick}
		/>
	{:else if notificationType === NotificationsTypesSchema.enum.account_created}
		<NotificationNewAccountCreated {notification} onUserClick={handleOnUserNotificationClick} />
	{/if}
</div>
