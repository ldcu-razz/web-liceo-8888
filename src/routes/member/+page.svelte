<script lang="ts">
	import { goto } from '$app/navigation';
	import { MEMBER_TICKETS } from '$lib/constants/routes.constants';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(MEMBER_TICKETS);
	});
</script>
