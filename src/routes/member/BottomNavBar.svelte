<script lang="ts" module>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { MEMBER_PROFILE, MEMBER_TICKETS } from '$lib/constants/routes.constants';

	type Props = {
		createTicket?: () => void;
	};
</script>

<script lang="ts">
	let { createTicket }: Props = $props();

	import { CirclePlusIcon, TicketIcon, UserCog } from '@lucide/svelte';

	let isActiveTickets = $derived(page.url.pathname.includes(MEMBER_TICKETS));
	let isActiveProfile = $derived(page.url.pathname.includes(MEMBER_PROFILE));

	function handleCreateTicket() {
		createTicket?.();
	}
</script>

<div class="fixed right-0 bottom-4 left-0 mx-auto flex w-full max-w-[560px] justify-center">
	<div class="flex justify-center rounded-full bg-slate-950 px-3 py-2.5">
		<div class="align-center flex gap-3">
			<a
				href={MEMBER_TICKETS}
				class="flex items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950 {isActiveTickets
					? 'bg-white text-slate-950!'
					: ''}"
			>
				<TicketIcon class="size-5" />
				<span class="text-xs">Tickets</span>
			</a>
			<div
				class="flex cursor-pointer items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950"
				role="button"
				tabindex="0"
				onclick={handleCreateTicket}
				onkeydown={handleCreateTicket}
			>
				<CirclePlusIcon class="size-5" />
				<span class="text-xs">Create Ticket</span>
			</div>
			<a
				href={MEMBER_PROFILE}
				class="flex items-center gap-2 rounded-full p-2 text-white hover:bg-white hover:text-slate-950 {isActiveProfile
					? 'bg-white text-slate-950!'
					: ''}"
			>
				<UserCog class="size-5" />
				<span class="text-xs">Profile</span>
			</a>
		</div>
	</div>
</div>
