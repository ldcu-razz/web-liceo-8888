<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOGIN } from '$lib/constants';
	import { onMount } from 'svelte';
	import { systemSettingsStore } from '$lib/store/system-settings.store';

	let systemSettings = $derived($systemSettingsStore);
	let isMaintenanceMode = $derived(systemSettings?.is_maintenance_mode ?? false);

	onMount(() => {
		if (!isMaintenanceMode) goto(LOGIN);
	});
</script>
