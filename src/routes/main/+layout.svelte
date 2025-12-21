<script lang="ts">
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import { SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import SidebarMenu from '$lib/components/ui/sidebar/sidebar-menu.svelte';
	import Sidebar from '$lib/components/ui/sidebar/sidebar.svelte';
	import type { SidebarModel } from '$lib/models/sidebar/sidebar.model';
	import { Building2, ChartBarBig, ChevronsUpDown, FolderKanban, Users } from '@lucide/svelte';
	import AppNavbar from './AppNavbar.svelte';
	import { page } from '$app/stores';
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PROFILE, LOGIN, BOARD, DASHBOARD, DEPARTMENTS, USERS } from '$lib/constants/routes.constants';
	import { goto } from '$app/navigation';

  let { children } = $props();

  let sidebarMenuItems = $state<SidebarModel>([
    {
      label: "Dashboard",
      href: DASHBOARD,
      icon: ChartBarBig,
    },
    {
      label: "Board",
      href: BOARD,
      icon: FolderKanban,
    },
    {
      label: "Departments",
      href: DEPARTMENTS,
      icon: Building2,
    },
    {
      label: "Users",
      href: USERS,
      icon: Users,
    },
  ]);
</script>

<SidebarProvider>
  <Sidebar collapsible="offcanvas" class="border-e-0!">
    <SidebarHeader class="p-4 pt-6">
      <MainAvatar />
    </SidebarHeader>
    <SidebarContent class="p-2 border-0">
      <SidebarMenu>
        {#each sidebarMenuItems as item (item.label)}
          <SidebarMenuItem>
            <SidebarMenuButton isActive={$page.url.pathname.includes(item.href)}>
              <item.icon />
              <a href={item.href} class="w-full">{item.label}</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        {/each}
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter class="p-2 mb-2 flex flex-row items-center gap-2">
      <Popover>
        <PopoverTrigger class="flex flex-row items-center gap-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer w-full">
          <UserAvatar name="John Doe" />
          <span class="text-sm font-medium">John Doe</span>
          <ChevronsUpDown class="size-4 ml-auto" />
        </PopoverTrigger>
        <PopoverContent class="w-48 p-1">
          <div class="flex flex-col">
            <Button variant="ghost" href={PROFILE} class="justify-start w-full">
              Profile
            </Button>
            <Button 
              variant="ghost" 
              class="justify-start w-full text-destructive hover:text-destructive"
              onclick={() => goto(LOGIN)}
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </SidebarFooter>
  </Sidebar>
  <main class="w-full min-h-screen bg-gray-50 py-3 px-2">
    <div class="border border-border rounded-lg h-full bg-white">
      <AppNavbar>
        {#snippet sidebarTrigger()}
          <SidebarTrigger />
        {/snippet}
      </AppNavbar>
      <div class="p-4">
        {@render children?.()}
      </div>
    </div>
  </main>
</SidebarProvider>