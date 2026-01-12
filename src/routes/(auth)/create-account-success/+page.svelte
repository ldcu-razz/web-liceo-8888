<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOGIN } from '$lib';
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { BadgeCheckIcon } from '@lucide/svelte';

	function goToLogin() {
		goto(LOGIN);
	}
</script>

<div class="absolute top-8 left-8">
	<MainAvatar />
</div>

<div class="flex h-full flex-col items-center justify-center">
	<div class="mx-auto mb-10 flex max-w-sm flex-col gap-6 text-center">
		<div class="flex justify-center">
			<BadgeCheckIcon class="h-12 w-12 text-green-700" />
		</div>
		<h1 class="text-2xl font-bold">Account Created Successfully!</h1>
		<p class="text-md text-gray-500">
			Your account will be verified by the administrator and you will receive a notification when it is approved.
		</p>
	</div>

	<div class="w-full max-w-sm">
		<Button class="w-full" variant="secondary" onclick={goToLogin}>Go to Login</Button>
	</div>
</div>
