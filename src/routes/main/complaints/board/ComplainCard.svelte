<script lang="ts" module>
  import type { Complaints } from "$lib/models/complaints/complaints.type";

  export type Props = {
    complaint: Complaints;
    onClick?: ( complaint: Complaints ) => void;
  }
</script>

<script lang="ts">
	import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
	import { AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import Avatar from "$lib/components/ui/avatar/avatar.svelte";
	import { TagIcon } from "@lucide/svelte";

  let { complaint, onClick }: Props = $props();

  function handleClick() {
    onClick?.(complaint);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(complaint);
    }
  }
</script>

<div 
  class="flex flex-col gap-1 border border-gray-200 rounded-xs p-2 bg-white hover:shadow-xs hover:bg-slate-50 cursor-pointer" 
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={handleKeyDown}
>
  <div class="flex justify-between items-center gap-2">
    <div class="flex items-center gap-2">
      <div class="size-3 rounded-full">
        <TagIcon class="size-3 text-gray-500" />
      </div>
      <span class="text-xs font-medium text-ellipsis line-clamp-1">{complaint.code}</span>
    </div>

    <Avatar class="size-5">
      <AvatarImage src={complaint.imageUrl} />
      <AvatarFallback>{complaint.current_user_assigned?.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  </div>

  <div class="flex items-center justify-between gap-2">
    <span class="text-sm font-semibold text-ellipsis line-clamp-1">{complaint.subject}</span>
    <PriorityIcons priority={complaint.priority} />
  </div>
</div>