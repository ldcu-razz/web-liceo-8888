<script lang="ts">
	import type { UserRolesEnum } from "$lib/models/users/users.type";
	import { transformText } from "$lib/utils/texts.utils";
	import { User, UserCheck, Users, UserStar } from "@lucide/svelte";

  type Props = {
    role: UserRolesEnum;
  };

  let { role }: Props = $props();
</script>

<div
  class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
  class:text-blue-700!={role === "super_admin"}
  class:text-green-700!={role === "admin"}
  class:text-red-700!={role === "user"}
  class:text-purple-700!={role === "department_staff"}
>
  {#if role === "super_admin"}
    <UserStar class="size-3 text-blue-700" />
  {:else if role === "admin"}
    <UserCheck class="size-3 text-green-700" />
  {:else if role === "user"}
    <User class="size-3 text-red-700" />
  {:else if role === "department_staff"}
    <Users class="size-3 text-purple-700" />
  {/if}
  <span class="capitalize">{transformText(role)}</span>
</div>