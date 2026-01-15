<script lang="ts">
	import { TriangleAlertIcon } from '@lucide/svelte';
</script>

<div class="mx-auto mt-6 flex w-full max-w-lg flex-col items-center justify-center gap-2">
	<div class="flex items-center justify-center rounded-full bg-rose-100 p-4">
		<TriangleAlertIcon class="h-12 w-12 text-rose-500" />
	</div>
	<h1 class="text-2xl font-bold">Account creation limit reached</h1>
	<p class="text-md text-center text-gray-500">
		Account creation limit reached. Please contact the administrator for assistance.
	</p>
</div>
