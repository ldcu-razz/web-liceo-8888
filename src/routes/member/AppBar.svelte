<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftIcon } from '@lucide/svelte';

	export type Props = {
		title: string;
		backButton?: boolean;
		backButtonOnClick?: () => void;
	};
</script>

<script lang="ts">
	let { title, backButton = true, backButtonOnClick }: Props = $props();

	function handleBackButtonClick() {
		backButtonOnClick?.();
	}
</script>

<div
	class="align-center fixed top-0 right-0 left-0 z-10 mx-auto flex w-full max-w-[620px] flex-col gap-3 border-b border-gray-200 bg-white px-3 py-4 shadow-xs"
>
	<div class="flex items-center gap-4">
		{#if backButton}
			<Button
				variant="outline"
				size="icon-sm"
				class="p-0! text-gray-700"
				onclick={handleBackButtonClick}
			>
				<ArrowLeftIcon class="size-4" />
			</Button>
		{/if}

		<div class="text-md line-clamp-1 font-semibold text-ellipsis">{title}</div>
	</div>
</div>
