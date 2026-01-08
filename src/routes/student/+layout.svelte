<script lang="ts">
	import { Dialog, DialogContent, DialogDescription, DialogTitle } from '$lib/components/ui/dialog';
	import BottomNavBar from './BottomNavBar.svelte';
	import CreateTicketFormForStudent, {
		type FormData,
		initialFormData
	} from './CreateTicketFormForStudent.svelte';

	let { children } = $props();

	let showCreateTicketialog = $state(false);

	let createTicketFormData = $state<FormData>({ ...initialFormData });

	function handleToggleCreateTicketDialog() {
		showCreateTicketialog = true;
	}

	function handleSubmitTicket(formData: FormData) {
		console.log(formData);
	}

	function handleCancelTicket() {
		showCreateTicketialog = false;
	}
</script>

<main
	class="items-between mx-auto flex h-screen w-full max-w-[562px] flex-col border-x border-border bg-slate-50 pb-20"
>
	{@render children?.()}

	<BottomNavBar createTicket={handleToggleCreateTicketDialog} />
</main>

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
