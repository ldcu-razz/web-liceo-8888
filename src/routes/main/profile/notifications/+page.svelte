<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let systemNotification = $state(false);
</script>

<div class="flex flex-col py-4">
	<div class="mb-6 flex justify-between">
		<h1 class="text-md text-2xl font-semibold">Notifications</h1>
	</div>

	<div class="align-items flex justify-between rounded-lg border border-border p-3">
		<div class="flex items-center space-x-2">
			<Switch id="system-notification" bind:checked={systemNotification} />
			<Label for="system-notification">System Notification</Label>
		</div>
		<div class="flex flex-col gap-2">
			<span class="text-xs text-muted-foreground">
				Enable system notifications will received notifications from the system.
			</span>
		</div>
	</div>
</div>
