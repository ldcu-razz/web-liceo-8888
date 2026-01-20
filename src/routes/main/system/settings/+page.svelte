<script lang="ts">
	import {
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import AlertDialog from '$lib/components/ui/alert-dialog/alert-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import type { PutSystemSettings } from '$lib/models/system/system-settings.type';
	import {
		systemSettingsActions,
		systemSettingsLoadingStore,
		systemSettingsStore
	} from '$lib/store/system-settings.store';
	import { fromDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Loader } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let systemSettingsId = $state<string>('');
	let ticketCreationLimit = $state<number>(0);
	let ticketStartDateCount = $state<string>('');
	let numberOfUsersCreationLimit = $state<number>(0);
	let maintenanceMode = $state<boolean>(false);
	let systemSettingsLoading = $derived($systemSettingsLoadingStore);
	let resetAllUsersTicketLimitLoading = $state(false);

	let showResetAllUsersTicketLimitAlertDialog = $state<boolean>(false);

	let ticketStartDateCountValue = $derived<DateValue | undefined>(
		ticketStartDateCount && !isNaN(new Date(ticketStartDateCount).getTime())
			? fromDate(new Date(ticketStartDateCount), getLocalTimeZone())
			: undefined
	);

	let todayDate = $state<DateValue | undefined>(fromDate(new Date(), getLocalTimeZone()));

	$inspect(ticketStartDateCountValue);

	$effect(() => {
		systemSettingsId = $systemSettingsStore?.id ?? '';
		ticketCreationLimit = $systemSettingsStore?.number_of_tickets_creation_limit ?? 0;
		numberOfUsersCreationLimit = $systemSettingsStore?.number_of_users_creation_limit ?? 0;
		maintenanceMode = $systemSettingsStore?.is_maintenance_mode ?? false;
	});

	function handleUpdateSystemSettings(payload: PutSystemSettings) {
		if (!systemSettingsId) {
			return;
		}

		if (
			payload.number_of_tickets_creation_limit &&
			$systemSettingsStore?.number_of_tickets_creation_limit === ticketCreationLimit
		) {
			return;
		}

		if (
			payload.number_of_users_creation_limit &&
			$systemSettingsStore?.number_of_users_creation_limit === numberOfUsersCreationLimit
		) {
			return;
		}

		if (
			payload.is_maintenance_mode &&
			$systemSettingsStore?.is_maintenance_mode === maintenanceMode
		) {
			return;
		}

		systemSettingsActions.updateSystemSettings(systemSettingsId, payload);
	}

	function handleShowResetAllUsersTicketLimitAlertDialog() {
		showResetAllUsersTicketLimitAlertDialog = true;
	}

	async function handleResetAllUsersTicketLimit() {
		resetAllUsersTicketLimitLoading = true;
		await systemSettingsActions.resetAllUsersTicketLimit(ticketCreationLimit);
		resetAllUsersTicketLimitLoading = false;
		showResetAllUsersTicketLimitAlertDialog = false;
	}
</script>

{#if systemSettingsLoading}
	<div class="flex h-full items-center justify-center">
		<Loader class="size-4 animate-spin" />
		<span class="ml-2 text-sm text-gray-500">Loading...</span>
	</div>
{:else}
	<div class="h-full bg-white p-8">
		<h1 class="mb-4 text-lg font-semibold">System Settings</h1>
		<div class="grid auto-rows-fr grid-cols-12 gap-4 rounded-md bg-white">
			<div class="col-span-6 h-full">
				<div class="flex h-full flex-col gap-2 rounded-md border border-border p-4">
					<div class="flex flex-col gap-1">
						<div class="text-xs font-medium">Number of Tickets Creation Limit</div>
						<p class="text-xs text-muted-foreground">
							The number of tickets that can be created by a user.
						</p>
					</div>
					<Input
						type="number"
						bind:value={ticketCreationLimit}
						onblur={() =>
							handleUpdateSystemSettings({ number_of_tickets_creation_limit: ticketCreationLimit })}
					/>
					<p></p>
					<div class="flex flex-col gap-1">
						<div class="text-xs font-medium">Reset all users ticket limit</div>
						<p class="text-xs text-muted-foreground">
							The reset all users ticket limit is used to reset the ticket limit for all users.
						</p>
					</div>
					<div class="mt-3 flex justify-start">
						<Button
							variant="destructive"
							size="sm"
							disabled={resetAllUsersTicketLimitLoading}
							onclick={() => handleShowResetAllUsersTicketLimitAlertDialog()}
							>Reset All Users Ticket Limit</Button
						>
					</div>
				</div>
			</div>

			<div class="col-span-6 h-full">
				<div class="flex h-full flex-col gap-2 rounded-md border border-border p-4">
					<div class="flex flex-col gap-1">
						<div class="text-xs font-medium">Number of Users Creation Limit</div>
						<p class="text-xs text-muted-foreground">
							The number of users that can be created by the system.
						</p>
					</div>
					<Input
						type="number"
						bind:value={numberOfUsersCreationLimit}
						onblur={() =>
							handleUpdateSystemSettings({
								number_of_users_creation_limit: numberOfUsersCreationLimit
							})}
					/>
				</div>
			</div>

			<div class="col-span-6 h-full">
				<div class="flex h-full flex-col gap-2 rounded-md border border-border p-4">
					<div class="flex flex-col gap-1">
						<div class="text-xs font-medium">Maintenance Mode</div>
						<p class="text-xs text-muted-foreground">
							The maintenance mode is used to disable the system for maintenance.
						</p>
					</div>
					<Switch
						id="maintenance-mode"
						bind:checked={maintenanceMode}
						onCheckedChange={() =>
							handleUpdateSystemSettings({ is_maintenance_mode: maintenanceMode })}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<AlertDialog bind:open={showResetAllUsersTicketLimitAlertDialog}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Reset All Users Ticket Limit</AlertDialogTitle>
		</AlertDialogHeader>
		<AlertDialogDescription>
			{#if resetAllUsersTicketLimitLoading}
				<div class="mb-2 flex items-center justify-center">
					<Loader class="size-6 animate-spin" />
					<span class="ml-2 text-xl text-gray-950">Resetting...</span>
				</div>
				<div>
					Please wait for the action to complete. Don't close the page or refresh the page until the
					action is complete.
				</div>
			{:else}
				Resetting the ticket limit for all users will reset the ticket limit for all users to the
				system settings ticket limit. Please note that this action is irreversible.
			{/if}
		</AlertDialogDescription>
		<AlertDialogFooter>
			<Button
				variant="destructive"
				disabled={resetAllUsersTicketLimitLoading}
				onclick={() => handleResetAllUsersTicketLimit()}
			>
				{#if resetAllUsersTicketLimitLoading}
					<Loader class="size-4 animate-spin" />
				{/if}
				Yes, Reset
			</Button>
			<Button
				variant="outline"
				disabled={resetAllUsersTicketLimitLoading}
				onclick={() => (showResetAllUsersTicketLimitAlertDialog = false)}>Cancel</Button
			>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
