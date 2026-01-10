<script lang="ts" module>
	import AppBar from '../../AppBar.svelte';
	import { meActions, meStore } from '$lib/store/me.store';
	import ChangePasswordForm, {
		type FormData as ChangePasswordFormData
	} from '../../../main/profile/account/ChangePasswordForm.svelte';
	import { goto } from '$app/navigation';
	import { MEMBER_PROFILE } from '$lib/constants';
	import { OctagonAlertIcon } from '@lucide/svelte';
</script>

<script lang="ts">
	let me = $derived($meStore);

	let errorMessage = $state<string>('');

	function handleBackButtonClick() {
		goto(MEMBER_PROFILE);
	}

	async function handleSubmit(formData: ChangePasswordFormData) {
		try {
			await meActions.changePassword(formData.currentPassword, formData.password, me?.id ?? '');
			goto(MEMBER_PROFILE);
		} catch (error) {
			errorMessage = (error as Error).message;
			console.error(error);
		}
	}
</script>

<section>
	<AppBar title="Change Password" backButtonOnClick={handleBackButtonClick} />

	<div class="mx-4 mt-24">
		{#if errorMessage}
			<div class="mb-4 flex items-center gap-2 rounded-md bg-red-500/10 p-2 text-xs text-red-700">
				<OctagonAlertIcon class="size-4" />
				<span>{errorMessage}</span>
			</div>
		{/if}
		<ChangePasswordForm onCancel={handleBackButtonClick} onSubmit={handleSubmit} />
	</div>
</section>
