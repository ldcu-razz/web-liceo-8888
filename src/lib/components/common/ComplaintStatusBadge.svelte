<script lang="ts" module>
  import type { ComplaintStatuses } from "$lib/models/complaints/complaints.type";
	import { cn } from "$lib/utils";
	import { transformText } from "$lib/utils/texts.utils";
	import { ChevronDown } from "@lucide/svelte";

  type Props = {
    status: ComplaintStatuses;
    size?: "sm" | "md" | "lg";
  }
</script>

<script lang="ts">
	import DropdownMenu from "../ui/dropdown-menu/dropdown-menu.svelte";
	import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
	import { ComplaintStatusesSchema } from "$lib/models/complaints/complaints.schema";

  let { status, size = "md" }: Props = $props();

  const statusColors: Record<ComplaintStatuses, string> = {
    "backlog": "bg-gray-50",
    "ready": "bg-yellow-100",
    "in_progress": "bg-blue-100",
    "in_review": "bg-purple-100",
    "done": "bg-green-100",
    "archived": "bg-rose-100",
  }

  const borderColors: Record<ComplaintStatuses, string> = {
    "backlog": "border-gray-200",
    "ready": "border-yellow-200",
    "in_progress": "border-blue-200",
    "in_review": "border-purple-200",
    "done": "border-green-200",
    "archived": "border-rose-200",
  }

  let statuses: ComplaintStatuses[] = ComplaintStatusesSchema.options;

  let sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    <div class={cn("border rounded-sm px-2.5 py-1.5 font-medium text-gray-700 cursor-pointer", sizeClasses[size], statusColors[status], borderColors[status])}>
      <div class="flex items-center gap-2">
        <span class="capitalize {sizeClasses[size]}">{transformText(status)}</span>
        <ChevronDown class="size-4" />
      </div>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {#each statuses as status}
      <DropdownMenuItem class="p-1.5">
        <span class="capitalize {sizeClasses[size]}">{transformText(status)}</span>
      </DropdownMenuItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>