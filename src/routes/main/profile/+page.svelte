<script lang="ts">
	import { AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { meActions, meStore } from '$lib/store/me.store';
	import { transformText } from '$lib/utils/texts.utils';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { departmentsMap } from '$lib/store/departments.store';

	let me = $derived($meStore);
	let department = $derived($departmentsMap[me?.department_id ?? '']);
	let meInitial = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);

	let fileInput: HTMLInputElement | null = null;

	const openImagePicker = () => {
		fileInput?.click();
	};

	const handleImageSelected = async (event: Event) => {
		const target = event.target as HTMLInputElement;

		if (!target.files?.length) return;

		const [file] = target.files;
		await meActions.uploadAvatar(file);
	};

	function handleRemoveAvatar() {
		meActions.removeAvatar();
	}

	// Get signed URL for avatar dynamically
	const avatarSignedUrl = useSignedUrl(() => me?.avatar);
</script>

<div class="flex flex-col gap-6 py-4">
	<div class="flex items-center gap-5">
		<Avatar class="size-28 border-3">
			<AvatarImage src={avatarSignedUrl.url} class="object-cover" />
			<AvatarFallback>
				<div class="text-4xl font-bold">
					{meInitial}
				</div>
			</AvatarFallback>
		</Avatar>

		<div class="flex gap-2">
			<input
				accept="image/*"
				bind:this={fileInput}
				class="hidden"
				type="file"
				onchange={handleImageSelected}
			/>

			<Button variant="outline" size="sm" class="p-2 text-xs" onclick={openImagePicker}
				>Upload Picture</Button
			>
			<Button variant="outline" size="sm" class="p-2 text-xs" onclick={handleRemoveAvatar}
				>Delete Picture</Button
			>
		</div>
	</div>

	<div class="flex flex-col gap-2 rounded-xl border border-dashed border-gray-300 p-6">
		<div class="flex justify-between">
			<h2 class="text-md font-semibold">Profile Information</h2>
		</div>
		<div class="mt-2 grid grid-cols-12 gap-6">
			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">RFID</span>
				<span class="text-sm">{me?.rfid_number ?? ''}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Firstname</span>
				<span class="text-sm">{me?.firstname ?? ''}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Lastname</span>
				<span class="text-sm">{me?.lastname ?? ''}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Sex</span>
				<span class="text-sm">{transformText(me?.sex ?? '')}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Birthdate</span>
				<span class="text-sm"
					>{new Date(me?.birthdate ?? '').toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					})}</span
				>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Contact</span>
				<span class="text-sm">{me?.contact_number ?? ''}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Email</span>
				<span class="text-sm">{me?.email ?? ''}</span>
			</div>

			<div class="col-span-4 flex flex-col gap-1">
				<span class="text-xs text-gray-500">Department</span>
				<span class="text-sm">{department?.name ?? ''}</span>
			</div>
		</div>
	</div>
</div>
