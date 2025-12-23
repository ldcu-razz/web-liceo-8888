<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import ChangePasswordForm from "./ChangePasswordForm.svelte";

  let isChangePasswordSheetOpen = $state(false);

  function handleChangePassword() {
    isChangePasswordSheetOpen = true;
  }

  function handleCancelChangePassword() {
    isChangePasswordSheetOpen = false;
  }
</script>

<div class="border border-border rounded-lg mt-4">
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border bg-gray-50">
    <h2 class="text-md font-semibold">Account Information</h2>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Username:</span>
      <span class="text-sm">@john.doe</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Password:</span>
      <Sheet bind:open={isChangePasswordSheetOpen}>
        <SheetTrigger>
          <Button variant="outline" size="sm" class="text-xs p-2" onclick={handleChangePassword}>Change Password</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Change Password</SheetTitle>
            <SheetDescription>Change the password for the user</SheetDescription>
          </SheetHeader>
          <ChangePasswordForm onCancel={handleCancelChangePassword} />
        </SheetContent>
      </Sheet>
    </div>
  </div>
</div>