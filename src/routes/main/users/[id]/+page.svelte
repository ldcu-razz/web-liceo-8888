<script lang="ts">
  import redWhiteGradientPattern from "$lib/assets/images/red-white-gradient-pattern.png";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@lucide/svelte";
	import UserPrimaryInfo from "./UserPrimaryInfo.svelte";
	import UserAccountInfo from "./UserAccountInfo.svelte";
	import Sheet from "$lib/components/ui/sheet/sheet.svelte";
	import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import UserForm from "../create/UserForm.svelte";
	import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";

  let isEditUserInfoSheetOpen = $state(false);
  let showArchiveUserAlertDialog = $state(false);

  function goBack() {
    window.history.back();
  }

  function handleCancelEditUserInfo() {
    isEditUserInfoSheetOpen = false;
  }

  function handleArchiveUser() {
    showArchiveUserAlertDialog = true;
  }
</script>

<div class="flex flex-col gap-4 container mx-auto">
  <div class="bg-image bg-cover bg-center h-36 rounded-md" style="background-image: url('{redWhiteGradientPattern}');"></div>

  <div class="min-w-xl mx-auto">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div class="rounded-full bg-gray-50 p-1 w-32 h-32 flex border border-gray-200 -mt-18">
          <img src={'https://github.com/evilrabbit.png'} alt="User" class="w-full h-full object-cover rounded-full" />
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
              <UserForm mode="update" formBordered={false} onCancel={handleCancelEditUserInfo} />
            </SheetContent>
          </Sheet>

          <Button variant="destructive" size="sm" onclick={handleArchiveUser}>
            <TrashIcon class="size-4"  />
            Archive
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold">John Doe</h1>
        <p class="text-sm text-gray-500">@john.doe</p>
      </div>
    </div>

    <UserPrimaryInfo />

    <UserAccountInfo />
  </div>
</div>

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