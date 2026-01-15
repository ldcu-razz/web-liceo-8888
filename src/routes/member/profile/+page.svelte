<script lang="ts">
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { meActions, meStore } from '$lib/store/me.store';
	import { transformText } from '$lib/utils/texts.utils';
	import { Button } from '$lib/components/ui/button';
	import AvatarUploader from '$lib/components/common/AvatarUploader.svelte';
	import { authActions, logginOutStore } from '$lib/store/auth.store';
	import AlertDialog from '$lib/components/ui/alert-dialog/alert-dialog.svelte';
	import {
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import { goto } from '$app/navigation';
	import { LOGIN, MEMBER_PROFILE_CHANGE_PASSWORD, MEMBER_PROFILE_EDIT } from '$lib/constants';
	import { LoaderCircle, PencilIcon } from '@lucide/svelte';

	import { departmentsMap } from '$lib/store/departments.store';

	let me = $derived($meStore);

	let department = $derived($departmentsMap[me?.department_id ?? '']);

	let intialName = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);

	let meBirthdate = $derived(
		new Date(me?.birthdate ?? '').toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	);

	let primaryInformation = $derived([
		{ 
			label: 'RFID', 
			value: me?.rfid_number 
		},
		{ 
			label: 'Fullname', 
			value: `${me?.firstname} ${me?.lastname}` 
		},
		{ 
			label: 'Sex', 
			value: transformText(me?.sex ?? '') 
		},
		{ 
			label: 'Birthdate', 
			value: meBirthdate 
		},
		{ 
			label: 'Email', 
			value: me?.email 
		},
		{ 
			label: 'Contact Number', 
			value: me?.contact_number 
		}
	]);

	let accountInformation = $derived([
		{ 
			label: 'Username', 
			value: `@${me?.username ?? ''}` 
		},
		{ 
			label: 'Status', 
			value: transformText(me?.status ?? '') 
		},
		{ 
			label: 'Role', 
			value: transformText(me?.role ?? '') 
		},
		{ 
			label: 'Department', 
			value: department?.name ?? '' 
		}
	]);

	let showLogoutAlertDialog = $state(false);
	let isLoggingOut = $derived($logginOutStore);

	async function handleLogout() {
		await authActions.logout();
		await goto(LOGIN);
	}

	function handleShowLogoutAlertDialog() {
		showLogoutAlertDialog = true;
	}

	function handleCloseLogoutAlertDialog() {
		showLogoutAlertDialog = false;
	}

	async function handleImageSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await meActions.uploadAvatar(file);
		}
	}

	function handleEditProfile() {
		goto(MEMBER_PROFILE_EDIT);
	}

	function handleChangePassword() {
		goto(MEMBER_PROFILE_CHANGE_PASSWORD);
	}
</script>

<section>
	<div class="h-42 rounded-b-2xl bg-rose-900 bg-linear-to-b from-red-800 to-rose-900"></div>
	<div class="-mt-14 flex flex-col items-center justify-center gap-2">
		<AvatarUploader
			avatar={me?.avatar ?? ''}
			name={intialName}
			avatarSize="size-38"
			layoutDirection="vertical"
			{handleImageSelected}
		/>

		<div class="mt-4 flex flex-col items-center">
			<h2 class="text-2xl font-bold">{me?.firstname} {me?.lastname}</h2>
			<p class="text-sm text-gray-500">@{me?.username}</p>
		</div>
	</div>

	<div class="mx-4 mt-12">
		<div class="align-items flex justify-between">
			<h3 class="text-md mb-2 font-semibold">Primary Information</h3>
			<Button variant="link" class="p-2 text-sm text-neutral-950" onclick={handleEditProfile}>
				<PencilIcon class="size-3" />
				Edit
			</Button>
		</div>
		<div class="rounded-xl border border-border bg-white">
			<div class="flex flex-col gap-2">
				{#each primaryInformation as info, index}
					{@const isLast = index === primaryInformation.length - 1}
					<div
						class="align-items flex justify-between p-3 {isLast ? '' : 'border-b border-border'}"
					>
						<div class="text-sm font-bold">
							{info.label}
						</div>
						<div class="text-sm">
							{info.value}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mx-4 mt-12">
		<h3 class="text-md mb-2 font-semibold">Account Information</h3>
		<div class="rounded-xl border border-border bg-white">
			<div class="flex flex-col gap-2">
				{#each accountInformation as info, index}
					{@const isLast = index === accountInformation.length - 1}
					<div
						class="align-items flex justify-between p-3 {isLast ? '' : 'border-b border-border'}"
					>
						<div class="text-sm font-bold">
							{info.label}
						</div>
						<div class="text-sm">
							{info.value}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mx-4 mt-12 flex flex-col gap-2">
		<Button variant="outline" class="text-md w-full py-6" onclick={handleChangePassword}>
			Change Password
		</Button>
		<Button variant="destructive" class="text-md w-full py-6" onclick={handleShowLogoutAlertDialog}>
			Logout
		</Button>
	</div>
</section>

<AlertDialog bind:open={showLogoutAlertDialog}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Logout</AlertDialogTitle>
			<AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<Button variant="outline" onclick={handleCloseLogoutAlertDialog}>Cancel</Button>
			<Button variant="destructive" disabled={isLoggingOut} onclick={handleLogout}>
				<span>Logout</span>
				{#if isLoggingOut}
					<LoaderCircle class="size-4 animate-spin" />
				{/if}
			</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
