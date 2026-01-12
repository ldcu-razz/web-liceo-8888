<script lang="ts" module>
	import { cn } from '$lib/utils';
	import { transformText } from '$lib/utils/texts.utils';
	import { ChevronDown } from '@lucide/svelte';
	import DropdownMenu from '../ui/dropdown-menu/dropdown-menu.svelte';
	import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
	import { UserStatusEnumSchema } from '$lib/models/users/users.schema';
	import type { UserStatusEnum } from '$lib/models/users/users.type';

	type Props = {
		status: UserStatusEnum;
		size?: 'sm' | 'md' | 'lg';
		onSelect?: (status: UserStatusEnum) => void;
	};
</script>

<script lang="ts">
	let { status, size = 'md', onSelect }: Props = $props();

	const statusColors: Record<UserStatusEnum, string> = {
		active: 'bg-green-100',
		inactive: 'bg-gray-100',
		archived: 'bg-red-100',
		needs_verification: 'bg-amber-100'
	};

	const borderColors: Record<UserStatusEnum, string> = {
		active: 'border-green-300',
		inactive: 'border-gray-300',
		archived: 'border-red-300',
		needs_verification: 'border-amber-300'
	};

	let statuses: UserStatusEnum[] = UserStatusEnumSchema.options;

	let sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-lg'
	};
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<div
			class={cn(
				'cursor-pointer rounded-sm border px-2.5 py-1.5 font-medium text-gray-700',
				sizeClasses[size],
				statusColors[status],
				borderColors[status]
			)}
		>
			<div class="flex items-center gap-2">
				<span class="capitalize {sizeClasses[size]}">{transformText(status)}</span>
				<ChevronDown class="size-4" />
			</div>
		</div>
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		{#each statuses as status}
			<DropdownMenuItem class="p-1.5" onclick={() => onSelect?.(status)}>
				<span class="capitalize {sizeClasses[size]}">{transformText(status)}</span>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
