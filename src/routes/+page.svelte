<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOGIN } from '$lib/constants';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(LOGIN);
	});
</script>
