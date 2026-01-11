<script lang="ts" module>
	import { transformText } from '$lib/utils/texts.utils';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { CheckIcon, ListStartIcon } from '@lucide/svelte';
	import type { TicketsPriorities } from '$lib/models/tickets/tickets.type';
	import PriorityIcons from './PriorityIcons.svelte';
	import { TicketsPrioritiesSchema } from '$lib/models/tickets/tickets.schema';

	export type Props = {
		selectedPriority: TicketsPriorities | string;
		disabled?: boolean;
		onPriorityChange?: (priority: TicketsPriorities) => void;
	};
</script>

<script lang="ts">
	let { selectedPriority = $bindable(), disabled = false, onPriorityChange }: Props = $props();

	let priorityName = $derived(transformText(selectedPriority));

	let openMenu = $state(false);

	let priorityOptions = TicketsPrioritiesSchema.options;

	function handlePrioritySelect(priority: TicketsPriorities) {
		selectedPriority = priority;
		onPriorityChange?.(priority);
		openMenu = false;
	}
</script>

<DropdownMenu bind:open={openMenu}>
	<DropdownMenuTrigger {disabled}>
		<div
			class="flex cursor-pointer items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
		>
			{#if selectedPriority && typeof selectedPriority === 'string'}
				<PriorityIcons priority={selectedPriority as TicketsPriorities} />
			{:else}
				<ListStartIcon class="size-5 text-gray-500" />
			{/if}
			<span class="text-xs capitalize">{priorityName || 'Priority'}</span>
		</div>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="min-w-62 p-2" side="bottom">
		{#each priorityOptions as priority}
			<DropdownMenuItem onclick={() => handlePrioritySelect(priority)}>
				<div class="flex w-full items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-1.5">
							<PriorityIcons {priority} showTooltip={false} />
						</div>
						<div class="overflow-hidden text-xs text-ellipsis whitespace-nowrap capitalize">
							{transformText(priority)}
						</div>
					</div>

					{#if priority === selectedPriority}
						<CheckIcon class="size-4 text-green-700" />
					{/if}
				</div>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
