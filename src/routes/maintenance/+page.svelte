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

<div class="h-screen w-screen flex items-center justify-center p-6">
  <div class="max-w-xl mx-auto text-center flex flex-col items-center justify-center gap-2">
    <img src={liceoLogo} alt="Liceo Logo" class="h-[60px] w-[320px]" />
    <div class="text-4xl font-bold mt-4">The site is currently down for maintenance.</div>
    <div class="text-lg text-md text-gray-500">We apologize for the inconvenience and will be back soon. Please check back later.</div>
  </div>
</div>