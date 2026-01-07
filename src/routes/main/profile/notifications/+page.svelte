<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	import Switch from "$lib/components/ui/switch/switch.svelte";

  let systemNotification = $state(false);
</script>

<div class="flex flex-col py-4">
  <div class="flex justify-between mb-6">
    <h1 class="text-md font-semibold text-2xl">Notifications</h1>
  </div>

  <div class="flex align-items justify-between p-3 border-border border rounded-lg">
    <div class="flex items-center space-x-2">
      <Switch id="system-notification" bind:checked={systemNotification} />
      <Label for="system-notification">System Notification</Label>
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-xs text-muted-foreground">
        Enable system notifications will received notifications from the system.
      </span>
    </div>
  </div>
</div>