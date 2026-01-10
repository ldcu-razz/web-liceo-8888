<script lang="ts" module>
	import { transformText } from '$lib/utils/texts.utils';
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
	import { DEFAULT_AVATAR } from '$lib/constants/avatar.constants';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { Input } from '../ui/input';
	import { CheckIcon } from '@lucide/svelte';
	import { departmentsStore } from '$lib/store/departments.store';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';

	export type Props = {
		selectedDepartmentId: string | null;
		onDepartmentChange?: (departmentId: string) => void;
	};
</script>

<script lang="ts">
	let { selectedDepartmentId = $bindable(), onDepartmentChange }: Props = $props();

	let departments = $derived($departmentsStore ?? []);

	let search = $state('');

	let filteredDepartments = $derived(
		departments?.filter((department) =>
			department.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	let selectedDepartment = $derived(
		departments?.find((department) => department.id === selectedDepartmentId)
	);

	let avatar = useSignedUrl(() => selectedDepartment?.avatar);

	let departmentName = $derived(transformText(selectedDepartment?.name ?? 'Assign Department'));

	let departmentInitial = $derived(selectedDepartment?.name?.slice(0, 2).toUpperCase() ?? 'AD');

	let openMenu = $state(false);

	function handleDepartmentSelect(departmentId: string) {
		selectedDepartmentId = departmentId;
		openMenu = false;
		search = '';
		onDepartmentChange?.(departmentId);
	}

	function handleUnassignedSelect() {
		selectedDepartmentId = null;
		openMenu = false;
		search = '';
		onDepartmentChange?.('');
	}

	function getDepartmentAvatar(avatar: string | null | undefined) {
		return useSignedUrl(() => avatar);
	}
</script>

<DropdownMenu bind:open={openMenu}>
	<DropdownMenuTrigger>
		<div
			class="flex cursor-pointer items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
		>
			<Avatar class="size-5 border border-gray-200">
				<AvatarImage src={avatar.url} class="object-cover" />
				<AvatarFallback class="text-[8px]">{departmentInitial}</AvatarFallback>
			</Avatar>
			<span class="max-w-42 overflow-hidden text-ellipsis whitespace-nowrap capitalize"
				>{departmentName}</span
			>
		</div>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="relative min-w-62 p-2" side="bottom">
		<div class="absolute top-0 left-0 mb-2 w-full p-2">
			<Input
				bind:value={search}
				placeholder="Search departments"
				class="w-full px-2 py-1 text-xs"
			/>
		</div>
		<div class="mt-12 max-h-62 max-w-62 overflow-y-auto">
			{#if filteredDepartments.length > 0}
				<DropdownMenuItem onclick={() => handleUnassignedSelect()}>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5">
								<Avatar class="size-5 border border-gray-200">
									<AvatarFallback class="text-[10px]">UN</AvatarFallback>
								</Avatar>
							</div>
							<div
								class="max-w-50 overflow-hidden text-xs text-ellipsis whitespace-nowrap capitalize"
							>
								Unassigned
							</div>
						</div>
					</div>
				</DropdownMenuItem>
				{#each filteredDepartments as department}
					<DropdownMenuItem onclick={() => handleDepartmentSelect(department.id)}>
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<div class="flex items-center gap-1.5">
									<Avatar class="size-5 border border-gray-200">
										<AvatarImage
											src={getDepartmentAvatar(department.avatar).url}
											class="object-cover"
										/>
										<AvatarFallback class="text-[10px]"
											>{department.name.slice(0, 2).toUpperCase()}</AvatarFallback
										>
									</Avatar>
								</div>
								<div class="max-w-50 overflow-hidden text-xs text-ellipsis whitespace-nowrap">
									{department.name}
								</div>
							</div>

							{#if department.id === selectedDepartmentId}
								<CheckIcon class="size-4 text-green-700" />
							{/if}
						</div>
					</DropdownMenuItem>
				{/each}
			{:else}
				<DropdownMenuItem class="text-center text-sm text-gray-500">
					<span>No departments found</span>
				</DropdownMenuItem>
			{/if}
		</div>
	</DropdownMenuContent>
</DropdownMenu>
