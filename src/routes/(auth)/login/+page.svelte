<script lang="ts">
	import { goto } from '$app/navigation';
	import { CREATE_ACCOUNT, MAIN } from '$lib';
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import { TriangleAlertIcon } from '@lucide/svelte';
	import LoginForm from './LoginForm.svelte';
	import type { FormData as LoginFormData } from './LoginForm.svelte';
	import { authActions } from '$lib/store/auth.store';

	let loading = $state(false);
	let errorMessage = $state<string | null>(null);

	function onSignUp() {
		goto(CREATE_ACCOUNT);
	}

	async function onLogin(formData: LoginFormData) {
		loading = true;
		try {
			await authActions.login({
				username: formData.username,
				password: formData.password
			});

			goto(MAIN);
		} catch (error: unknown) {
			errorMessage = (error as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col h-full w-full items-center justify-center">
	<div class="absolute top-8 left-8">
		<MainAvatar />
	</div>
	<div class="mb-10 flex flex-col gap-2 text-center">
		<h1 class="text-2xl font-bold">Login to your account</h1>
		<p class="text-md text-gray-500">Enter your username and password to login</p>
	</div>
	<div class="w-full max-w-sm">
		{#if errorMessage}
			<div class="p-4 bg-rose-100 mb-4 rounded-md w-full flex items-start gap-2">
				<TriangleAlertIcon class="size-4 text-rose-500 mt-0.5" />
				<p class="text-sm text-rose-500">
					{errorMessage}
				</p>
			</div>
		{/if}
		<LoginForm {loading} {onSignUp} {onLogin} />
	</div>
</div>