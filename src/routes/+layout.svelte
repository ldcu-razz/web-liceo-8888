<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Toaster />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
