<script lang="ts" module>
	import ComplaintStatusBadge from "$lib/components/common/ComplaintStatusBadge.svelte";
	import PriorityIcons from "$lib/components/common/PriorityIcons.svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { ItemContent } from "$lib/components/ui/item";
	import Item from "$lib/components/ui/item/item.svelte";
  import type { Complaints } from "$lib/models/complaints/complaints.type";
	import { TagIcon } from "@lucide/svelte";

  type Props = {
    complaint: Complaints;
    onClick?: ( complaint: Complaints ) => void;
  }
</script>

<script lang="ts">
  let { complaint, onClick }: Props = $props();

  function handleClick() {
    onClick?.(complaint);
  }
</script>

<div class="complaint-list-item cursor-pointer">
  <Item variant="outline" class="p-3 hover:bg-slate-50" onclick={handleClick}>
    <ItemContent>
      <div class="flex justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full">
            <TagIcon class="size-4 text-gray-500" />
          </div>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{complaint.code}</span>
          <span class="text-sm font-medium text-ellipsis line-clamp-1">{complaint.subject}</span>
        </div>

        <div class="flex items-center gap-2">
          <ComplaintStatusBadge status={complaint.status} size="sm" />
          <PriorityIcons priority={complaint.priority} />
          <Avatar class="size-5">
            <AvatarImage src={complaint.imageUrl} />
            <AvatarFallback>{complaint.current_user_assigned?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </ItemContent>
  </Item>
</div>