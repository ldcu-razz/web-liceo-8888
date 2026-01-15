<script lang="ts">
	import { goto } from '$app/navigation';
	import liceoLogo from '$lib/assets/images/liceo-logo.png';
	import { LOGIN } from '$lib/constants/routes.constants';
	import { systemSettingsStore } from '$lib/store/system-settings.store';
	import { onMount } from 'svelte';

	let systemSettings = $derived($systemSettingsStore);
	let isMaintenanceMode = $derived(systemSettings?.is_maintenance_mode ?? false);

	onMount(() => {
		if (!isMaintenanceMode) goto(LOGIN);
	});
</script>

<div class="flex h-screen w-screen items-center justify-center p-6">
	<div class="mx-auto flex max-w-xl flex-col items-center justify-center gap-2 text-center">
		<img src={liceoLogo} alt="Liceo Logo" class="h-[60px] w-[320px]" />
		<div class="mt-4 text-4xl font-bold">The site is currently down for maintenance.</div>
		<div class="text-md text-lg text-gray-500">
			We apologize for the inconvenience and will be back soon. Please check back later.
		</div>
	</div>
</div>
