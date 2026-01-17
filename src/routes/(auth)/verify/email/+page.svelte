<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import { LOGIN } from "$lib/constants";
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { authActions } from "$lib/store/auth.store";
	import { LoaderIcon } from "@lucide/svelte";

	let isAccountAlreadyVerified = $state(false);
	let isAccountVerified = $state(false);
	let isError = $state(false);
	let loading = $state(false);

	onMount(async () => {
		try {
			loading = true;
			const token = page.url.searchParams.get('token');
			if (token) {
				await authActions.verifyUserEmail(token);
			}

			isAccountVerified = true;
		} catch (error) {
			const errorMessage = (error as Error).message;
			if (errorMessage.includes('Account already verified')) {
				isAccountAlreadyVerified = true;
			} else {
				isError = true;
			}
		} finally {
			loading = false;
		}
	});
	function onLogin() {
		goto(LOGIN);
	}
</script>

{#if loading}
	<div class="flex flex-col items-center justify-center h-screen">
		<div class="flex flex-col gap-2 items-center justify-center">
			<h1 class="text-2xl font-bold flex items-center gap-2">
				<LoaderIcon class="size-10 animate-spin" />
				Verifying your email address...
			</h1>
			<p class="text-sm text-gray-500 text-center">Please wait while we verify your email address.</p>
		</div>
	</div>
{/if}

{#if isAccountVerified}
	<div class="max-w-sm mx-auto flex flex-col items-center justify-center h-screen">
		<div class="flex flex-col gap-2 items-center justify-center">
			<h1 class="text-2xl font-bold text-center">You Account Has Been Verified Successfully!</h1>
			<p class="text-sm text-gray-500 text-center">You can now login to your account.</p>
			<Button class="mt-4" variant="secondary" onclick={onLogin}>Go to Login</Button>
		</div>
	</div>
{/if}

{#if isAccountAlreadyVerified}
	<div class="max-w-sm mx-auto flex flex-col items-center justify-center h-screen">
		<div class="flex flex-col gap-2 items-center justify-center">
			<h1 class="text-2xl font-bold text-center">Account Already Verified</h1>
			<p class="text-sm text-gray-500 text-center">You can now login to your account If you think this is an error, please contact the administrator.</p>
			<Button class="mt-4" variant="secondary" onclick={onLogin}>Go to Login</Button>
		</div>
	</div>
{/if}

{#if isError}
	<div class="max-w-sm mx-auto flex flex-col items-center justify-center h-screen">
		<div class="flex flex-col gap-2 items-center justify-center">
			<h1 class="text-2xl font-bold text-center">Error Verifying Email</h1>
			<p class="text-sm text-gray-500 text-center">Please try again later or contact the administrator.</p>
			<Button class="mt-4" variant="secondary" onclick={onLogin}>Go to Login</Button>
		</div>
	</div>
{/if}