<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DialogContent, DialogDescription, DialogTitle } from '$lib/components/ui/dialog';
	import Dialog from '$lib/components/ui/dialog/dialog.svelte';
	import { meActions, meStore } from '$lib/store/me.store';
	import { CircleDotIcon, UserCog, UserIcon, UserLockIcon } from '@lucide/svelte';
	import ChangePasswordForm, {
		type FormData as ChangePasswordFormData
	} from './ChangePasswordForm.svelte';
	import DialogHeader from '$lib/components/ui/dialog/dialog-header.svelte';
	import UserRoleBadge from '$lib/components/common/UserRoleBadge.svelte';
	import { type UserRolesEnum } from '$lib/models/users/users.type';
	import type { BaseStatusEnum } from '$lib/models/common/common.type';
	import StatusBadge from '$lib/components/common/StatusBadge.svelte';
	import ChangeUsernameForm, {
		initialFormData as initialChangeUsernameFormData,
		type FormData as ChangeUsernameFormData
	} from './ChangeUsernameForm.svelte';

	let me = $derived($meStore);

	let changePasswordDialogOpen = $state(false);
	let isChangingPassword = $state(false);
	let errorMessage = $state<string>('');

	let changeUsernameFormData = $state<ChangeUsernameFormData>(initialChangeUsernameFormData);
	let changeUsernameDialogOpen = $state(false);
	let isChangingUsername = $state(false);
	let errorChangeUsernameMessage = $state<string>('');

	function handleToggleChangePasswordDialog() {
		changePasswordDialogOpen = !changePasswordDialogOpen;
	}

	async function handleSubmitChangePassword(formData: ChangePasswordFormData) {
		try {
			await meActions.changePassword(formData.currentPassword, formData.password, me?.id ?? '');
			changePasswordDialogOpen = false;
			isChangingPassword = false;
		} catch (error) {
			console.error(error);
			errorMessage = (error as Error).message;
		} finally {
			isChangingPassword = false;
		}
	}

	function handleToggleChangeUsernameDialog() {
		changeUsernameDialogOpen = !changeUsernameDialogOpen;
		if (changeUsernameDialogOpen) {
			changeUsernameFormData = {
				username: me?.username ?? ''
			};
		}
	}

	async function handleSubmitChangeUsername(formData: ChangeUsernameFormData) {
		try {
			isChangingUsername = true;
			await meActions.changeUsername(formData.username, me?.id ?? '');
			changeUsernameDialogOpen = false;
		} catch (error) {
			console.error(error);
			errorChangeUsernameMessage = (error as Error).message;
		} finally {
			isChangingUsername = false;
		}
	}
</script>

<div class="flex flex-col py-4">
	<div class="mb-6 flex justify-between">
		<h1 class="text-md text-2xl font-semibold">Account Information</h1>
	</div>

	<div class="align-items flex justify-between rounded-t-lg border border-b-0 border-border p-3">
		<div class="flex items-center gap-2">
			<UserIcon class="size-5" />
			<span class="text-sm">@{me?.username ?? ''}</span>
		</div>
		<div class="flex flex-col gap-2">
			<Button
				variant="outline"
				size="sm"
				class="p-2 text-xs"
				onclick={handleToggleChangeUsernameDialog}>Change Username</Button
			>
		</div>
	</div>

	<div class="align-items flex justify-between border border-b-0 border-border p-3">
		<div class="flex items-center gap-2">
			<UserLockIcon class="size-5" />
			<span class="text-sm">Password</span>
		</div>
		<div class="flex flex-col gap-2">
			<Button
				variant="outline"
				size="sm"
				class="p-2 text-xs"
				onclick={handleToggleChangePasswordDialog}>Change Password</Button
			>
		</div>
	</div>

	<div class="align-items flex justify-between border border-b-0 border-border p-3">
		<div class="flex items-center gap-2">
			<CircleDotIcon class="size-5" />
			<span class="text-sm">Status</span>
		</div>
		<div class="flex flex-col gap-2">
			<StatusBadge status={me?.status as BaseStatusEnum} />
		</div>
	</div>

	<div class="align-items flex justify-between rounded-b-lg border border-border p-3">
		<div class="flex items-center gap-2">
			<UserCog class="size-5" />
			<span class="text-sm">Role</span>
		</div>
		<div class="flex flex-col gap-2">
			<UserRoleBadge role={me?.role as UserRolesEnum} />
		</div>
	</div>
</div>

<Dialog bind:open={changePasswordDialogOpen}>
	<DialogContent class="sm:max-w-lg">
		<DialogHeader>
			<DialogTitle>Change Password</DialogTitle>
			<DialogDescription>Change the password for your account</DialogDescription>
		</DialogHeader>
		<div class="mt-4">
			<ChangePasswordForm
				{errorMessage}
				onCancel={handleToggleChangePasswordDialog}
				onSubmit={handleSubmitChangePassword}
			/>
		</div>
	</DialogContent>
</Dialog>

<Dialog bind:open={changeUsernameDialogOpen}>
	<DialogContent class="sm:max-w-lg">
		<DialogHeader>
			<DialogTitle>Change Username</DialogTitle>
			<DialogDescription>Change the username for your account</DialogDescription>
		</DialogHeader>
		<div class="mt-4">
			<ChangeUsernameForm
				bind:formData={changeUsernameFormData}
				errorMessage={errorChangeUsernameMessage}
				loading={isChangingUsername}
				onCancel={handleToggleChangeUsernameDialog}
				onSubmit={handleSubmitChangeUsername}
			/>
		</div>
	</DialogContent>
</Dialog>
