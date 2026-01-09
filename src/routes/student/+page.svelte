<script lang="ts">
	import { goto } from '$app/navigation';
	import { STUDENT_TICKETS } from '$lib/constants/routes.constants';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(STUDENT_TICKETS);
	});
</script>
