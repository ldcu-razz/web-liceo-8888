<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, User } from "@lucide/svelte";
	import UserForm, { type FormData } from "./UserForm.svelte";
	import { usersActions } from "$lib/store/users.store";
	import type { PostUsers } from "$lib/models/users/users.type";
	import { uuid } from "$lib/utils/uuid.util";
	import { PostUsersSchema } from "$lib/models/users/users.schema";
	import { USERS } from "$lib/constants";
	import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";

  let loading = $state(false);

  function goBack() {
    window.history.back();
  }

  async function handleCreateUser(formData: FormData) {
    loading = true;

    try {
      const data = {
        ...formData,
        id: uuid(),
        avatar: "",
        status: BaseStatusEnumSchema.enum.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const payload: PostUsers = PostUsersSchema.parse(data);

      await usersActions.createUser(payload);
      goto(USERS);
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
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
    <UserForm onCancel={goBack} onCreateUser={handleCreateUser} />
  </div>
</div>