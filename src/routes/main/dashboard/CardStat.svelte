<script lang="ts" module>
	type Props = {
		title: string;
		value: number;
		description?: string;
	};
</script>

<script lang="ts">
	let { title, value, description }: Props = $props();

	let valueFormatted = $derived(value.toLocaleString());
</script>

<div class="w-full rounded-md border border-border bg-linear-to-t from-gray-100 to-white p-5">
	<div class="text-sm font-normal text-gray-400">{title}</div>
	<div class="mt-3 text-3xl font-bold text-gray-900">{valueFormatted}</div>
	{#if description}
		<div class="mt-3 text-xs font-normal text-gray-700">{description}</div>
	{/if}
</div>
