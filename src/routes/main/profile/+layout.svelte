<script lang="ts" module>
	import { page } from '$app/stores';
	import { PROFILE, PROFILE_ACCOUNT, PROFILE_NOTIFICATIONS, PROFILE_SESSIONS } from '$lib';
	import { BellIcon, HistoryIcon, LockIcon, UserIcon } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type ProfileNavItem = {
		label: string;
		href: string;
		icon: Component;
	};
</script>

<script lang="ts">
	let { children } = $props();

	let profileNavItems: ProfileNavItem[] = $state([
		{
			label: 'Profile Information',
			href: PROFILE,
			icon: UserIcon
		},
		{
			label: 'Account',
			href: PROFILE_ACCOUNT,
			icon: LockIcon
		},
		{
			label: 'Notifications',
			href: PROFILE_NOTIFICATIONS,
			icon: BellIcon
		},
		{
			label: 'Sessions',
			href: PROFILE_SESSIONS,
			icon: HistoryIcon
		}
	]);
</script>

<div class="-mt-4 -mr-4 -ml-4 h-full bg-gray-50 p-4">
	<h1 class="mb-4 text-lg font-semibold">Profile Settings</h1>
	<div class="flex h-full rounded-md bg-white p-4">
		<div class="flex w-46 flex-col items-baseline">
			{#each profileNavItems as item (item.label)}
				{@const isActive = $page.url.pathname === item.href}
				<a
					href={item.href}
					class="flex flex-row items-center gap-2 rounded-full px-3 py-2 underline-offset-4 hover:underline {isActive
						? 'font-bold text-rose-800 underline'
						: ''}"
				>
					<item.icon class="size-4" />
					<span class="text-sm">{item.label}</span>
				</a>
			{/each}
		</div>
		<div class="mx-8 w-px bg-border"></div>
		<div class="h-full flex-1">
			{@render children()}
		</div>
	</div>
</div>
