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

<div class="flex flex-col h-full items-center justify-center">
  <div class="mb-10 flex flex-col gap-6 text-center max-w-sm mx-auto">
    <div class="flex justify-center">
      <BadgeCheckIcon class="w-12 h-12 text-green-700" />
    </div>
    <h1 class="text-2xl font-bold">Account Created Successfully!</h1>
    <p class="text-md text-gray-500">
      Your account has been created successfully. You can now login to the application using your credentials.
    </p>
  </div>

  <div class="w-full max-w-sm">
    <Button class="w-full" variant="secondary" onclick={goToLogin}> Go to Login </Button>
  </div>
</div>