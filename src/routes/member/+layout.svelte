<script lang="ts">
	import { Dialog, DialogContent, DialogDescription, DialogTitle } from '$lib/components/ui/dialog';
	import { meActions, meStore } from '$lib/store/me.store';
	import { onDestroy, onMount } from 'svelte';
	import BottomNavBar from './BottomNavBar.svelte';
	import CreateTicketFormForStudent, {
		type FormData,
		initialFormData
	} from './CreateTicketFormForStudent.svelte';
	import { UserRolesEnumSchema } from '$lib/models/users/users.schema';
	import { goto } from '$app/navigation';
	import { MAIN } from '$lib/constants';
	import type { PostTicket } from '$lib/models/tickets/tickets.type';
	import { uuid } from '$lib/utils/uuid.util';
	import {
		TicketsPrioritiesSchema,
		TicketStatusesSchema
	} from '$lib/models/tickets/tickets.schema';
	import { ticketsActions } from '$lib/store/tickets.store';
	import ScreenLoader from '../main/ScreenLoader.svelte';
	import { usersActions } from '$lib/store/users.store';
	import { notificationsActions } from '$lib/store/notifications.store';
	import { ticketCategoriesActions } from '$lib/store/ticket-categories.store';
	import { getNotificationChannel } from '$lib/services/notifications/notifications.service';

	let { children } = $props();

	let me = $derived($meStore);
	let showCreateTicketialog = $state(false);
	let createTicketFormData = $state<FormData>({ ...initialFormData });
	let neededDataLoaded = $state(false);

	let notificationChannel = $state<Awaited<ReturnType<typeof getNotificationChannel>>>();

	onMount(async () => {
		neededDataLoaded = false;
		await meActions.getMe();
		await usersActions.getAllUsers();
		await ticketCategoriesActions.getAllTicketCategories();
		if (me?.role !== UserRolesEnumSchema.enum.user) {
			await goto(MAIN);
			return;
		}
		neededDataLoaded = true;

		await notificationsActions.getNotifications({ page: 1, size: 15 }, me?.id ?? '');
		notificationChannel = getNotificationChannel(me?.id ?? '').subscribe();
	});

	function handleToggleCreateTicketDialog() {
		showCreateTicketialog = true;
	}

	async function handleSubmitTicket(formData: FormData) {
		const payload: PostTicket = {
			...formData,
			id: uuid(),
			category_id: formData.category_id || null,
			priority: TicketsPrioritiesSchema.enum.medium,
			reported_by: me?.id || '',
			status: TicketStatusesSchema.enum.backlog,
			code: '',
			current_department_assigned: null,
			current_user_assigned: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		await ticketsActions.createTicket(payload);
		showCreateTicketialog = false;
	}

	function handleCancelTicket() {
		showCreateTicketialog = false;
	}

	onDestroy(() => {
		notificationChannel?.unsubscribe();
	});
</script>

{#if neededDataLoaded}
	<main
		class="items-between mx-auto flex h-screen w-full max-w-[562px] flex-col border-x border-border bg-slate-50"
	>
		<div class="flex-1 overflow-y-auto pb-40">
			{@render children?.()}
		</div>

		<BottomNavBar createTicket={handleToggleCreateTicketDialog} />
	</main>
{:else}
	<ScreenLoader />
{/if}

<Dialog bind:open={showCreateTicketialog}>
	<DialogContent>
		<DialogTitle>Create Ticket</DialogTitle>
		<DialogDescription>
			<div>
				Input the details of the ticket you want to create. Double check the details before
				submitting.
			</div>
			<div class="mt-2">
				The input with <span class="text-red-500">*</span> are required fields.
			</div>
		</DialogDescription>

		<CreateTicketFormForStudent
			bind:formData={createTicketFormData}
			onSubmit={handleSubmitTicket}
			onCancel={handleCancelTicket}
		/>
	</DialogContent>
</Dialog>
