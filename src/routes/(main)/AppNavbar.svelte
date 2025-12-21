<script lang="ts">
	import UserAvatar from "$lib/components/common/UserAvatar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { BellDotIcon, BellIcon } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  let { sidebarTrigger }: { sidebarTrigger?: Snippet } = $props();
</script>

<div class="flex items-center justify-between border-b border-border p-2">
  <div class="flex items-center justify-between gap-2 w-full">
    {#if sidebarTrigger}
      {@render sidebarTrigger()}
    {/if}

    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <BellIcon class="size-5" />
      </Button>
      <UserAvatar name="John Doe" sizeClass="size-6" />
    </div>
  </div>
</div>