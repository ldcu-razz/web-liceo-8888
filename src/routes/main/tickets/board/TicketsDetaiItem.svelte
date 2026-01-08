<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = {
		title: string;
		children: Snippet;
	};
</script>

<script lang="ts">
	let { title, children }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<span class="w-42 text-sm font-normal">{title}</span>
	{@render children?.()}
</div>
