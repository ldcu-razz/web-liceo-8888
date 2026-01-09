<script lang="ts">
	import { Dialog, DialogContent, DialogDescription, DialogTitle } from '$lib/components/ui/dialog';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
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
	class="items-between mx-auto flex h-screen w-full max-w-[562px] flex-col border-x border-border bg-slate-50"
>
	<div class="flex-1 overflow-y-auto pb-30">
		{@render children?.()}
	</div>

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
