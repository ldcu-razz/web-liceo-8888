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
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { filesActions } from '$lib/store/files.store';

	let { children } = $props();

	let me = $derived($meStore);
	
	let showCreateTicketialog = $state(false);
	let createTicketFormData = $state<FormData>({ ...initialFormData });
	let createTicketLoading = $state(false);
	let neededDataLoaded = $state(false);

	let uploadedFiles = $state<File[]>([]);

	let notificationChannel = $state<Awaited<ReturnType<typeof getNotificationChannel>>>();

	let showNoTicketsLeftAlertDialog = $state(false);

	let ticketsCreationLimit = $derived(me?.properties?.[0]?.remaining_tickets_creation ?? 0);

	let bypassTicketCreationLimit = $derived(
		me?.properties?.[0]?.bypass_ticket_creation_limit ?? false
	);

	let isNoTicketsLeft = $derived(ticketsCreationLimit <= 0);

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
		if (isNoTicketsLeft && !bypassTicketCreationLimit) {
			showNoTicketsLeftAlertDialog = true;
			return;
		}

		showCreateTicketialog = true;
	}
	

	function resetForm() {
		createTicketFormData = { ...initialFormData };
		uploadedFiles = [];
	}

	
	
	async function handleSubmitTicket(formData: FormData) {
		try {
			createTicketLoading = true;
			const { attachments, ...rest } = formData;
			const payload: PostTicket = {
				...rest,
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
			

			await ticketsActions.createTicket(payload, uploadedFiles);
			if(!bypassTicketCreationLimit){
				await meActions.decrementTicketsCreation();
			}
			
			showCreateTicketialog = false;
			createTicketLoading = false;
			resetForm();
		} catch (error) {
			console.error(error);
		}
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
		class="items-between mx-auto flex h-screen w-full max-w-[620px] flex-col border-x border-border bg-slate-50"
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
	<DialogContent class="w-full sm:max-w-xl">
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
			bind:uploadedFiles
			loading={createTicketLoading}
			onSubmit={handleSubmitTicket}
			onCancel={handleCancelTicket}
		/>
	</DialogContent>
</Dialog>

<AlertDialog bind:open={showNoTicketsLeftAlertDialog}>
	<AlertDialogContent>
		<AlertDialogTitle>No tickets left</AlertDialogTitle>
		<AlertDialogDescription>
			You have no tickets left. You cannot create any more tickets. Wait for the next semester to
			start to get more tickets.
		</AlertDialogDescription>
		<AlertDialogFooter>
			<Button variant="outline" onclick={() => (showNoTicketsLeftAlertDialog = false)}>Okay</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
