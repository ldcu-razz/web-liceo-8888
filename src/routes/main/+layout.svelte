<script lang="ts">
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import {
		SidebarContent,
		SidebarFooter,
		SidebarHeader,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarProvider,
		SidebarTrigger
	} from '$lib/components/ui/sidebar';
	import SidebarMenu from '$lib/components/ui/sidebar/sidebar-menu.svelte';
	import Sidebar from '$lib/components/ui/sidebar/sidebar.svelte';
	import type { SidebarModel } from '$lib/models/sidebar/sidebar.model';
	import {
		Building2,
		ChartBarBig,
		ChevronsUpDown,
		CogIcon,
		FolderKanban,
		LoaderCircle,
		Tag,
		UserCog,
		Users
	} from '@lucide/svelte';
	import AppNavbar from './AppNavbar.svelte';
	import { page } from '$app/stores';
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		PROFILE,
		LOGIN,
		DASHBOARD,
		DEPARTMENTS,
		USERS,
		TICKETS_BOARD,
		TICKETS_CATEGORIES,
		MEMBER_MAIN,
		SYSTEM_SETTINGS
	} from '$lib/constants/routes.constants';
	import { goto, preloadCode } from '$app/navigation';
	import CollapsibleMenuItem from './CollapsibleMenuItem.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { departmentsActions } from '$lib/store/departments.store';
	import { browser } from '$app/environment';
	import { usersActions } from '$lib/store/users.store';
	import { authActions, authStore, logginOutStore } from '$lib/store/auth.store';
	import { ticketCategoriesActions } from '$lib/store/ticket-categories.store';
	import { meActions, meStore } from '$lib/store/me.store';
	import ScreenLoader from './ScreenLoader.svelte';
	import { UserRolesEnumSchema } from '$lib/models/users/users.schema';
	import { getNotificationChannel } from '$lib/services/notifications/notifications.service';

	let { children } = $props();

	let neededDataLoaded = $state(false);

	let me = $derived($meStore);
	let meInitial = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);
	let isMeDefartmentStaff = $derived(me?.role === UserRolesEnumSchema.enum.department_staff);
	let isMeAdmin = $derived(me?.role === UserRolesEnumSchema.enum.admin);
	let isMeSuperAdmin = $derived(me?.role === UserRolesEnumSchema.enum.super_admin);

	let meAvatar = $derived(me?.avatar ?? '');

	let notificationChannel = $state<Awaited<ReturnType<typeof getNotificationChannel>>>();

	if (browser) {
		preloadCode(DASHBOARD);
		preloadCode(TICKETS_BOARD);
		preloadCode(TICKETS_CATEGORIES);
		preloadCode(DEPARTMENTS);
		preloadCode(USERS);
		preloadCode(PROFILE);
	}

	let sidebarMenuItems = $derived<SidebarModel>([
		{
			label: 'Dashboard',
			href: DASHBOARD,
			icon: ChartBarBig
		},
		{
			label: 'Tickets',
			icon: FolderKanban,
			children: [
				{
					label: 'Board',
					href: TICKETS_BOARD,
					icon: FolderKanban
				},
				{
					label: 'Categories',
					href: TICKETS_CATEGORIES,
					icon: Tag
				}
			]
		},
		...(isMeAdmin || isMeSuperAdmin
			? [
					{
						label: 'Departments',
						href: DEPARTMENTS,
						icon: Building2
					}
				]
			: []),
		...(isMeSuperAdmin
			? [
					{
						label: 'Users',
						href: USERS,
						icon: Users
					}
				]
			: []),
		{
			label: 'Profile',
			href: PROFILE,
			icon: UserCog
		},
		{
			label: 'System Settings',
			href: SYSTEM_SETTINGS,
			icon: CogIcon
		}
	]);

	let isLoggingOut = $derived($logginOutStore);

	onMount(async () => {
		await meActions.getMe();
		if (me?.role === UserRolesEnumSchema.enum.user) {
			await goto(MEMBER_MAIN);
		}

		await departmentsActions.getDepartments({ page: 1, size: 25 });
		await usersActions.getAllUsers();
		await ticketCategoriesActions.getAllTicketCategories();

		neededDataLoaded = true;

		notificationChannel = getNotificationChannel(me?.id ?? '').subscribe();
	});

	async function handleLogout() {
		await authActions.logout();
		goto(LOGIN);
	}

	onDestroy(() => {
		notificationChannel?.unsubscribe();
	});
</script>

{#if neededDataLoaded}
	<SidebarProvider>
		<Sidebar collapsible="offcanvas" class="h-full border-e-0!">
			<SidebarHeader class="p-4 pt-6">
				<MainAvatar />
			</SidebarHeader>
			<SidebarContent class="border-0 p-2">
				<SidebarMenu>
					{#each sidebarMenuItems as item (item.label)}
						<SidebarMenuItem>
							{#if item.children}
								<CollapsibleMenuItem {item} />
							{:else}
								<SidebarMenuButton
									isActive={item.href ? $page.url.pathname.includes(item.href) : false}
								>
									<item.icon />
									<a href={item.href} class="w-full">{item.label}</a>
								</SidebarMenuButton>
							{/if}
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter class="mb-2 flex flex-row items-center gap-2 p-2">
				<Popover>
					<PopoverTrigger
						class="flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-2 hover:bg-gray-100"
					>
						<UserAvatar name={meInitial} imageLink={meAvatar} />
						<span class="text-sm font-medium">{me?.firstname ?? ''} {me?.lastname ?? ''}</span>
						<ChevronsUpDown class="ml-auto size-4" />
					</PopoverTrigger>
					<PopoverContent class="w-48 p-1">
						<div class="flex flex-col">
							<Button
								variant="ghost"
								class="w-full justify-start text-destructive hover:text-destructive"
								disabled={isLoggingOut}
								onclick={handleLogout}
							>
								<span>Logout</span>
								{#if isLoggingOut}
									<LoaderCircle class="size-4 animate-spin" />
								{/if}
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</SidebarFooter>
		</Sidebar>
		<main class="flex min-h-screen flex-1 bg-gray-50 px-2 py-3">
			<div class="flex flex-1 flex-col rounded-lg border border-border bg-white">
				<AppNavbar>
					{#snippet sidebarTrigger()}
						<SidebarTrigger />
					{/snippet}
				</AppNavbar>
				<div class="h-full flex-1 p-4">
					{@render children?.()}
				</div>
			</div>
		</main>
	</SidebarProvider>
{:else}
	<ScreenLoader />
{/if}

<svelte:head>
	<title>Liceo 8888</title>
</svelte:head>
