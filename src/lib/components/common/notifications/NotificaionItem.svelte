<script lang="ts" module>
	import NotificationAssignedUserTicket from './NotificationAssignedUserTicket.svelte';
	import NotificationAssignedDepartmentTicket from './NotificationAssignedDepartmentTicket.svelte';
	import NotificationCommentedTicket from './NotificationCommentedTicket.svelte';
	import NotificationCreatedTicket from './NotificationCreatedTicket.svelte';
	import NotificationUpdateTicket from './NotificationUpdateTicket.svelte';
	import { type GetNotifications } from '$lib/models/notifications/notifications.type';
	import { NotificationsTypesSchema } from '$lib/models/notifications/notifications.schema';

	type Props = {
		notification: GetNotifications;
		onClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	let { notification, onClick }: Props = $props();

	let notificationType = $derived(notification.type);

	function handleNotificationClick(id: string) {
		onClick?.(id);
	}
</script>

<div class="flex flex-col p-4 hover:bg-gray-200">
	{#if notificationType === NotificationsTypesSchema.enum.ticket_created}
		<NotificationCreatedTicket {notification} onClick={handleNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_updated}
		<NotificationUpdateTicket {notification} onClick={handleNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_commented}
		<NotificationCommentedTicket {notification} onClick={handleNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_department_assigned}
		<NotificationAssignedDepartmentTicket {notification} onClick={handleNotificationClick} />
	{:else if notificationType === NotificationsTypesSchema.enum.ticket_user_assigned}
		<NotificationAssignedUserTicket {notification} onClick={handleNotificationClick} />
	{/if}
</div>
