<script lang="ts">
	import EmailVerifyAccountTemplate from "./EmailVerifyAccountTemplate.svelte";
	import TicketStatusInProgress from "./TicketStatusInProgress.svelte";
	import TicketStatusDone from "./TicketStatusDone.svelte";
	import TicketHasNewComment from "./TicketHasNewComment.svelte";
</script>

<div class="flex flex-col gap-8 items-center justify-center p-8">
	<div class="w-full">
		<h2 class="text-2xl font-bold mb-4 text-center">Email Verification Template</h2>
		<EmailVerifyAccountTemplate />
	</div>
	
	<div class="w-full border-t-4 border-gray-300 pt-8">
		<h2 class="text-2xl font-bold mb-4 text-center">Ticket In Progress Template</h2>
		<TicketStatusInProgress />
	</div>

	<div class="w-full border-t-4 border-gray-300 pt-8">
		<h2 class="text-2xl font-bold mb-4 text-center">Ticket Done Template</h2>
		<TicketStatusDone />
	</div>

	<div class="w-full border-t-4 border-gray-300 pt-8">
		<h2 class="text-2xl font-bold mb-4 text-center">Ticket New Comment Template</h2>
		<TicketHasNewComment />
	</div>
</div>