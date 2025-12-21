<script lang="ts">
  import { goto } from '$app/navigation';
  import { DASHBOARD } from '$lib/constants/routes.constants';
  import { onMount } from 'svelte';

  onMount(() => {
    goto(DASHBOARD);
  });
</script>