<script lang="ts">
	import { goto } from '$app/navigation';
	import { CREATE_ACCOUNT, MAIN } from '$lib';
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import LoginForm from './LoginForm.svelte';
	import type { FormData as LoginFormData } from './LoginForm.svelte';

	function onSignUp() {
		goto(CREATE_ACCOUNT);
	}

	function onLogin(formData: LoginFormData) {
		goto(MAIN);
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
		<LoginForm {onSignUp} {onLogin} />
	</div>
</div>