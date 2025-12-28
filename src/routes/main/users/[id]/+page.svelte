<script lang="ts">
  import redBannerGradientPattern from "$lib/assets/images/red-banner-gradient.png";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, PencilIcon } from "@lucide/svelte";
	import UserPrimaryInfo from "./UserPrimaryInfo.svelte";
	import UserAccountInfo from "./UserAccountInfo.svelte";
	import Sheet from "$lib/components/ui/sheet/sheet.svelte";
	import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import UserForm from "../create/UserForm.svelte";
	import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";
	import { currentSelectedUser, currentSelectedUserLoading, usersActions } from "$lib/store/users.store";
	import UserStatusBadge from "$lib/components/common/UserStatusBadge.svelte";
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/stores";
	import type { BaseStatusEnum } from "$lib/models/common/common.type";
	import UserDetailsSkeleton from "./UserDetailsSkeleton.svelte";
	import { type FormData as UserFormDataUpdate , defaultFormData } from "../create/UserForm.svelte";
	import { getObjectDiff } from "$lib/utils/property.utils";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import { transformText } from "$lib/utils/texts.utils";

  let isEditUserInfoSheetOpen = $state(false);
  let showArchiveUserAlertDialog = $state(false);
  let currentUser = $derived($currentSelectedUser);
  let currentUserLoading = $derived($currentSelectedUserLoading);
  let currentUserId = $state($page.params.id);

  let formData: UserFormDataUpdate = $state({ ...defaultFormData });

  let currentUserInitialData: UserFormDataUpdate = { ...defaultFormData };

  let userAvatar = $derived(currentUser?.avatar || DEFAULT_AVATAR);

  let userFullName = $derived(transformText(`${currentUser?.firstname} ${currentUser?.lastname}`));

  onMount(async () => {
    if (currentUserId) {
      await usersActions.getUser(currentUserId);
    }

    if (currentUser) {
      formData = {
        ...defaultFormData,
        ...currentUser,
      };
      
      currentUserInitialData = {
        ...currentUserInitialData,
        ...currentUser,
      };
    }
  });

  function handleUpdateUserStatus(status: BaseStatusEnum) {
    if (currentUserId) {
      usersActions.updateUserStatus(currentUserId, status);
    }
  }

  function goBack() {
    window.history.back();
  }

  function handleCancelEditUserInfo() {
    isEditUserInfoSheetOpen = false;
  }

  function handleArchiveUser() {
    showArchiveUserAlertDialog = true;
  }

  async function handleUpdateUser(updateFormData: Partial<UserFormDataUpdate>) {
    if (currentUserId) {
      const data = {
        ...getObjectDiff(updateFormData, currentUserInitialData),
        updatedAt: new Date().toISOString(),
      };
       
      await usersActions.updateUser(currentUserId, data);
      isEditUserInfoSheetOpen = false;
    }
  }

  onDestroy(() => {
    usersActions.resetCurrentSelectedUserId();
  });
</script>

{#if currentUserLoading}
  <div class="flex flex-col gap-4 container mx-auto">
    <UserDetailsSkeleton />
  </div>
{:else}
  <div class="flex flex-col gap-4 container mx-auto">
    <div class="bg-image bg-cover bg-center h-42 rounded-md" style="background-image: url('{redBannerGradientPattern}');"></div>

    <div class="min-w-xl mx-auto">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="rounded-full bg-gray-50 p-1 w-32 h-32 flex border border-gray-200 -mt-18">
            <Avatar class="size-full">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>
                <div class="text-2xl font-bold">
                  {userFullName.slice(0, 2).toUpperCase()}
                </div>
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" onclick={goBack}>
              <ArrowLeftIcon class="size-4" />
              Back
            </Button>
            <Sheet bind:open={isEditUserInfoSheetOpen}>
              <SheetTrigger>
                <Button variant="outline" size="sm">
                  <PencilIcon class="size-4" />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent class="min-w-3xl">
                <SheetHeader>
                  <SheetTitle>Edit User Information</SheetTitle>
                  <SheetDescription>Edit the user information</SheetDescription>
                </SheetHeader>
                <UserForm mode="update" bind:formData={formData} formBordered={false} onCancel={handleCancelEditUserInfo} onUpdateUser={handleUpdateUser} />
              </SheetContent>
            </Sheet>

            {#if currentUser}
              <UserStatusBadge status={currentUser.status} onSelect={handleUpdateUserStatus} />
            {/if}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-semibold">{currentUser?.firstname ?? ''} {currentUser?.lastname ?? ''}</h1>
          <p class="text-sm text-gray-500">@{currentUser?.username ?? ''}</p>
        </div>
      </div>

      {#if currentUser}
        <UserPrimaryInfo user={currentUser ?? {}} />
        <UserAccountInfo user={currentUser} />
      {/if}
    </div>
  </div>
{/if}


<AlertDialog bind:open={showArchiveUserAlertDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to archive the user John Doe?</AlertDialogTitle>
      <AlertDialogDescription>Archiving this user will remove all related data.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleArchiveUser}>Archive</Button>
      <Button variant="outline" onclick={() => showArchiveUserAlertDialog = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>