<script lang="ts" module>
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import DropdownMenu from "$lib/components/ui/dropdown-menu/dropdown-menu.svelte";
  import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";

  export type DepartmentsDataTableActionsProps = {
    id: string;
    disabledArchive?: boolean;
    onView?: (id: string) => void;
    onArchive?: (id: string) => void;
  };
</script>

<script lang="ts">
 
  let { id, disabledArchive = false, onView, onArchive }: DepartmentsDataTableActionsProps = $props();
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel class="text-xs text-gray-500">Actions</DropdownMenuLabel>
    <DropdownMenuItem onclick={() => onView?.(id)}>
      <span>View</span>
    </DropdownMenuItem>
    <DropdownMenuItem onclick={() => onArchive?.(id)} disabled={disabledArchive}>
      <span class="text-destructive">Archive</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>