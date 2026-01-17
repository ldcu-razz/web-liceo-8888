<script lang="ts" module>
	import { Switch } from '$lib/components/ui/switch';
	import type { PutUserProperties, UserProperties } from '$lib/models/users/user-properties.type';
	import { uuid } from '$lib/utils/uuid.util';
	import { usersActions } from '$lib/store/users.store';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	export type Props = {
		userId: string;
		userProperties: UserProperties | null;
	};
</script>

<script lang="ts">
	let { userId, userProperties }: Props = $props();

	let bypassTicketCreationLimit = $derived(userProperties?.bypass_ticket_creation_limit ?? false);

	let remainingTicketsCreation = $state<number | null>(0);

	let userPropertiesId = $derived(userProperties?.id ?? '');

	$inspect(userProperties);

	onMount(() => {
		remainingTicketsCreation = userProperties?.remaining_tickets_creation ?? 0;
	});

	function handleUpdateUserProperties(payload: PutUserProperties) {
		console.log(userPropertiesId);
		if (!userPropertiesId) {
			handleCreateUserProperties();
			return;
		}

		usersActions.updateUserProperties(userId, userProperties?.id ?? '', payload);
	}

	function handleCreateUserProperties() {
		usersActions.createUserProperties(userId, {
			id: uuid(),
			user_id: userId,
			remaining_tickets_creation: remainingTicketsCreation ?? 0,
			bypass_ticket_creation_limit: bypassTicketCreationLimit
		});
	}
</script>

<div class="mt-4 rounded-lg border border-border">
	<div
		class="flex items-center justify-between bg-gray-50 px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<h2 class="text-md font-semibold">Properties</h2>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex flex-1 items-center justify-between gap-2">
			<span class="w-52 text-sm text-gray-500">Remaining Tickets Creation</span>
			<div class="flex items-center gap-2">
				<Input type="number" class="w-24" bind:value={remainingTicketsCreation} min="0" />
				<Button
					variant="outline"
					size="sm"
					disabled={remainingTicketsCreation === userProperties?.remaining_tickets_creation ||
						!remainingTicketsCreation}
					onclick={() =>
						handleUpdateUserProperties({
							remaining_tickets_creation: remainingTicketsCreation ?? undefined
						})}
				>
					Save
				</Button>
			</div>
		</div>
	</div>

	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex flex-1 items-center justify-between gap-2">
			<span class="w-52 text-sm text-gray-500">Bypass Ticket Creation Limit</span>
			<Switch
				id="bypass-ticket-creation-limit"
				bind:checked={bypassTicketCreationLimit}
				onCheckedChange={() =>
					handleUpdateUserProperties({ bypass_ticket_creation_limit: bypassTicketCreationLimit })}
			/>
		</div>
	</div>
</div>
