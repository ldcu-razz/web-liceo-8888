<script lang="ts" module>
	import { Button } from "$lib/components/ui/button";
	import type { Complaints } from "$lib/models/complaints/complaints.type";
	import { ChevronDownIcon } from "@lucide/svelte";
	import ComplaintsListItem from "./ComplaintsListItem.svelte";

  type Props = {
    complaints: Complaints[];
    onComplainClick?: ( complaint: Complaints ) => void;
  }
</script>

<script lang="ts">
  let { complaints, onComplainClick }: Props = $props();
</script>

<div class="flex flex-col gap-2">
  {#each complaints as complaint (complaint.id)}
    <ComplaintsListItem complaint={complaint} onClick={onComplainClick} />
  {/each}
  <div class="flex justify-center">
    <Button variant="ghost" size="sm">
      <ChevronDownIcon class="size-4" />
      Show more
    </Button>
  </div>
</div>