<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { systemSettingsActions, systemSettingsStore } from '$lib/store/system-settings.store';
	import { goto } from '$app/navigation';
	import { MAINTENANCE } from '$lib/constants';
	import { page } from '$app/state';

	let { children } = $props();

	let loading = $state(false);

	let systemSettings = $derived($systemSettingsStore);
	let isMaintenanceMode = $derived(systemSettings?.is_maintenance_mode ?? false);
	let route = $derived(page.url.pathname);
	let isMaintenanceRoute = $derived(route.includes(MAINTENANCE));

	onMount(async () => {
		loading = true;
		await systemSettingsActions.getSystemSettings();
		if (isMaintenanceMode && !isMaintenanceRoute) {
			goto(MAINTENANCE);
		}
		loading = false;
	});
</script>

<Toaster />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}
