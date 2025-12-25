<script lang="ts" module>
	import SexBadge from "$lib/components/common/SexBadge.svelte";
	import StatusBadge from "$lib/components/common/StatusBadge.svelte";
	import UserRoleBadge from "$lib/components/common/UserRoleBadge.svelte";
	import UserStatusBadge from "$lib/components/common/UserStatusBadge.svelte";
  import type { Users } from "$lib/models/users/users.type";
	import { departmentsMap } from "$lib/store/departments.store";
	import { transformText } from "$lib/utils/texts.utils";

  export type Props = {
    user: Users;
  };
</script>

<script lang="ts">
  let { user }: Props = $props();

  let department = $derived($departmentsMap[user?.department_id ?? '']);

  function formatBirthdate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).replace(', ', ' ').replace(/\s(AM|PM)/, '$1');
  }
</script>

<div class="border border-border rounded-lg mt-4">
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed bg-gray-50">
    <h2 class="text-md font-semibold">Primary Information</h2>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">RFID:</span>
      <span class="text-sm">{user?.rfid_number ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Firstname:</span>
      <span class="text-sm">{user?.firstname ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Lastname:</span>
      <span class="text-sm">{user?.lastname ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Sex:</span>
      <SexBadge sex={user?.sex ?? ''} />
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Birthdate:</span>
      <span class="text-sm">{formatBirthdate(user?.birthdate ?? '')}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Email:</span>
      <span class="text-sm">{user?.email ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Contact Number:</span>
      <span class="text-sm">{user?.contact_number ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Department:</span>
      <span class="text-sm">{department?.name ?? ''}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Role:</span>
      <UserRoleBadge role={user?.role ?? ''} />
    </div>
  </div>

  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Status:</span>
      <StatusBadge status={user?.status ?? ''} />
    </div>
  </div>

  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Created At:</span>
      <span class="text-sm">{formatDate(user?.createdAt ?? '')}</span>
    </div>
  </div>
  <div class="flex items-center justify-between py-2 px-4 not-last:border-b not-last:border-border not-last:border-dashed">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 w-42">Updated At:</span>
      <span class="text-sm">{formatDate(user?.updatedAt ?? '')}</span>
    </div>
  </div>
</div>