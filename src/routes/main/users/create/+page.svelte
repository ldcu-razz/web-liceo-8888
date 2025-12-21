<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, User, UserPlus } from "@lucide/svelte";
	import UserForm from "./UserForm.svelte";

  function goBack() {
    window.history.back();
  }
</script>
<div class="flex flex-col gap-4 max-w-4xl mx-auto mt-2">
  <div class="flex w-full justify-start mb-5">
    <Button variant="ghost" onclick={goBack}>
      <ArrowLeftIcon class="w-4 h-4" />
      Back to Users
    </Button>
  </div>
  <div class="flex items-center justify-between">
    <div class="rounded-full bg-blue-50 p-2 w-12 h-12 flex items-center justify-center">
      <User class="size-6 text-blue-500" />
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold">Create New User</h1>
    <p class="text-sm text-gray-500">Create a new user by filling out the form below.</p>
  </div>

  <div class="mt-2">
    <UserForm onCancel={goBack} />
  </div>
</div>