<script lang="ts" module>
	import SexBadge from '$lib/components/common/SexBadge.svelte';
	import StatusBadge from '$lib/components/common/StatusBadge.svelte';
	import UserRoleBadge from '$lib/components/common/UserRoleBadge.svelte';
	import type { Users } from '$lib/models/users/users.type';
	import { departmentsMap } from '$lib/store/departments.store';

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
			year: 'numeric'
		});
	}

	function formatDate(date: string) {
		return new Date(date)
			.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			})
			.replace(', ', ' ')
			.replace(/\s(AM|PM)/, '$1');
	}
</script>

<div class="mt-4 rounded-lg border border-border">
	<div
		class="flex items-center justify-between bg-gray-50 px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<h2 class="text-md font-semibold">Primary Information</h2>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">RFID:</span>
			<span class="text-sm">{user?.rfid_number ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Firstname:</span>
			<span class="text-sm">{user?.firstname ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Lastname:</span>
			<span class="text-sm">{user?.lastname ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Sex:</span>
			<SexBadge sex={user?.sex ?? ''} />
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Birthdate:</span>
			<span class="text-sm">{formatBirthdate(user?.birthdate ?? '')}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Email:</span>
			<span class="text-sm">{user?.email ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Contact Number:</span>
			<span class="text-sm">{user?.contact_number ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Department:</span>
			<span class="text-sm">{department?.name ?? ''}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Role:</span>
			<UserRoleBadge role={user?.role ?? ''} />
		</div>
	</div>

	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Status:</span>
			<StatusBadge status={user?.status ?? ''} />
		</div>
	</div>

	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Created At:</span>
			<span class="text-sm">{formatDate(user?.createdAt ?? '')}</span>
		</div>
	</div>
	<div
		class="flex items-center justify-between px-4 py-2 not-last:border-b not-last:border-dashed not-last:border-border"
	>
		<div class="flex items-center gap-2">
			<span class="w-42 text-sm text-gray-500">Updated At:</span>
			<span class="text-sm">{formatDate(user?.updatedAt ?? '')}</span>
		</div>
	</div>
</div>
