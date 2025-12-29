<script lang="ts" module>
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { EllipsisIcon } from "@lucide/svelte";

  export type TicketsCategoriesDataTableActionsProps = {
    id: string;
    disabledArchive?: boolean;
    onView?: (id: string) => void;
    onArchive?: (id: string) => void;
  };
</script>

<script lang="ts">
  let { id, disabledArchive = false, onView, onArchive }: TicketsCategoriesDataTableActionsProps = $props();
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
    <DropdownMenuItem onclick={() => onView?.(id)}>
      <span>View</span>
    </DropdownMenuItem>
    <DropdownMenuItem onclick={() => onArchive?.(id)} disabled={disabledArchive}>
      <span class="text-destructive">Archive</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>