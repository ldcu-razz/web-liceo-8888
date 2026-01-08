<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import ChangePasswordForm, {
		type FormData as ChangePasswordFormData
	} from './ChangePasswordForm.svelte';
	import type { Users } from '$lib/models/users/users.type';
	import { usersActions } from '$lib/store/users.store';

	export type Props = {
		user: Users;
	};
</script>

<script lang="ts">
	let { user }: Props = $props();

	let isChangePasswordSheetOpen = $state(false);

	function handleChangePassword() {
		isChangePasswordSheetOpen = true;
	}

	function handleCancelChangePassword() {
		isChangePasswordSheetOpen = false;
	}

	function handleSubmitChangePassword(formData: ChangePasswordFormData) {
		usersActions.updatePassword(user.id, formData.password);
		isChangePasswordSheetOpen = false;
	}
</script>

<div class="mt-4 rounded-lg border border-border">
	<div
		class="flex items-center justify-between bg-gray-50 px-4 py-2 not-last:border-b not-last:border-border"
	>
		<h2 class="text-md font-semibold">Account Information</h2>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Username:</span>
			<span class="text-sm">@{user?.username ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Password:</span>
			<Sheet bind:open={isChangePasswordSheetOpen}>
				<SheetTrigger>
					<Button variant="outline" size="sm" class="p-2 text-xs" onclick={handleChangePassword}
						>Change Password</Button
					>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Change Password</SheetTitle>
						<SheetDescription>Change the password for the user</SheetDescription>
					</SheetHeader>
					<ChangePasswordForm
						onCancel={handleCancelChangePassword}
						onSubmit={handleSubmitChangePassword}
					/>
				</SheetContent>
			</Sheet>
		</div>
	</div>
</div>
