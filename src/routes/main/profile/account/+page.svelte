<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { DialogContent, DialogDescription, DialogTitle } from "$lib/components/ui/dialog";
	import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import { meActions, meStore } from "$lib/store/me.store";
	import { transformText } from "$lib/utils/texts.utils";
	import { CircleDotIcon, UserCog, UserIcon, UserLockIcon } from "@lucide/svelte";
	import ChangePasswordForm, { type FormData as ChangePasswordFormData } from "./ChangePasswordForm.svelte";
	import DialogHeader from "$lib/components/ui/dialog/dialog-header.svelte";

  let me = $derived($meStore);

  let changePasswordDialogOpen = $state(false);

  let isChangingPassword = $state(false);

  let errorMessage = $state<string>("");

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
</script>

<div class="flex flex-col py-4">
  <div class="flex justify-between mb-6">
    <h1 class="text-md font-semibold text-2xl">Account Information</h1>
  </div>

  <div class="flex align-items justify-between p-3 border-border border rounded-t-lg border-b-0">
    <div class="flex items-center gap-2">
      <UserIcon class="size-5" /> 
      <span class="text-sm">@{me?.username ?? ''}</span>
    </div>
    <div class="flex flex-col gap-2">
      <Button variant="outline" size="sm" class="text-xs p-2">Change Username</Button>
    </div>
  </div>

  <div class="flex align-items justify-between p-3 border-border border border-b-0">
    <div class="flex items-center gap-2">
      <CircleDotIcon class="size-5" />
      <span class="text-sm">Active</span>
    </div>
    <div class="flex flex-col gap-2">
      <Button variant="outline" size="sm" class="text-xs p-2">Change Status</Button>
    </div>
  </div>

  <div class="flex align-items justify-between p-3 border-border border border-b-0">
    <div class="flex items-center gap-2">
      <UserLockIcon class="size-5" /> 
      <span class="text-sm">Password</span>
    </div>
    <div class="flex flex-col gap-2">
      <Button variant="outline" size="sm" class="text-xs p-2" onclick={handleToggleChangePasswordDialog}>Change Password</Button>
    </div>
  </div>

  <div class="flex align-items justify-between p-3 border-border border rounded-b-lg">
    <div class="flex items-center gap-2">
      <UserCog class="size-5" /> 
      <span class="text-sm">{transformText(me?.role ?? '')}</span>
    </div>
    <div class="flex flex-col gap-2">
      <Button variant="outline" size="sm" class="text-xs p-2" disabled>Change Role</Button>
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
      <ChangePasswordForm {errorMessage} onCancel={handleToggleChangePasswordDialog} onSubmit={handleSubmitChangePassword} />
    </div>
  </DialogContent>
</Dialog>