<script lang="ts">
	import { Loader } from '@lucide/svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-2">
		<Loader class="size-10 animate-spin" />
		<p class="text-md text-gray-900">Setting up. Please wait...</p>
	</div>
</div>
