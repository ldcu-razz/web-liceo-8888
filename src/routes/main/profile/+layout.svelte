<script lang="ts" module>
	import { page } from '$app/stores';
	import { PROFILE, PROFILE_ACCOUNT, PROFILE_NOTIFICATIONS, PROFILE_SESSIONS } from '$lib';
	import { BellIcon, HistoryIcon, LockIcon, UserIcon } from '@lucide/svelte';
	import type { Component } from 'svelte';

  type ProfileNavItem = {
    label: string;
    href: string;
    icon: Component;
  }
</script>

<script lang="ts">
  let { children } = $props();

  let profileNavItems: ProfileNavItem[] = $state([
    {
      label: 'Profile Information',
      href: PROFILE,
      icon: UserIcon,
    },
    {
      label: 'Account',
      href: PROFILE_ACCOUNT,
      icon: LockIcon,
    },
    {
      label: 'Notifications',
      href: PROFILE_NOTIFICATIONS,
      icon: BellIcon,
    },
    {
      label: 'Sessions',
      href: PROFILE_SESSIONS,
      icon: HistoryIcon,
    },
  ]);
</script>

<div class="bg-gray-50 -ml-4 -mr-4 -mt-4 p-4 h-full">
  <h1 class="font-semibold text-lg mb-4">Profile Settings</h1>
  <div class="flex bg-white rounded-md p-4 h-full">
    <div class="flex flex-col w-46 items-baseline">
      {#each profileNavItems as item (item.label)}
        {@const isActive = $page.url.pathname === item.href}
        <a href={item.href} class="flex flex-row items-center gap-2 py-2 px-3 rounded-full hover:underline underline-offset-4 {isActive ? 'font-bold underline text-rose-800' : ''}">
          <item.icon class="size-4" />
          <span class="text-sm">{item.label}</span>
        </a>
      {/each}
    </div>
    <div class="w-px bg-border mx-8"></div>
    <div class="flex-1 h-full">
      {@render children()}
    </div>
  </div>
</div>