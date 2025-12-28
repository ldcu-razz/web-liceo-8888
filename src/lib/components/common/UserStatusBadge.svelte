<script lang="ts" module>
  import type { ComplaintStatuses } from "$lib/models/complaints/complaints.type";
	import { cn } from "$lib/utils";
	import { transformText } from "$lib/utils/texts.utils";
	import { ChevronDown } from "@lucide/svelte";
  import DropdownMenu from "../ui/dropdown-menu/dropdown-menu.svelte";
  import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
  import type { BaseStatusEnum } from "$lib/models/common/common.type";
	import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";

  type Props = {
    status: BaseStatusEnum;
    size?: "sm" | "md" | "lg";
    onSelect?: (status: BaseStatusEnum) => void;
  }
</script>

<script lang="ts">

  let { status, size = "md", onSelect }: Props = $props();

  const statusColors: Record<BaseStatusEnum, string> = {
    "active": "bg-green-700",
    "inactive": "bg-gray-500",
    "archived": "bg-red-700",
  }

  const borderColors: Record<BaseStatusEnum, string> = {
    "active": "border-green-500",
    "inactive": "border-gray-300",
    "archived": "border-red-500",
  }

  let statuses: BaseStatusEnum[] = BaseStatusEnumSchema.options;

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
        <span class="capitalize text-white {sizeClasses[size]}">{transformText(status)}</span>
        <ChevronDown class="size-4 text-white" />
      </div>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {#each statuses as status}
      <DropdownMenuItem class="p-1.5" onclick={() => onSelect?.(status)}>
        <span class="capitalize {sizeClasses[size]}">{transformText(status)}</span>
      </DropdownMenuItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>