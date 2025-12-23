<script lang="ts" module>
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { EllipsisIcon } from "@lucide/svelte";

  export type ComplaintsCategoriesDataTableActionsProps = {
    id: string;
    onView?: (id: string) => void;
    onDelete?: (id: string) => void;
  };
</script>

<script lang="ts">
  let { id, onView, onDelete }: ComplaintsCategoriesDataTableActionsProps = $props();
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
    <DropdownMenuItem onclick={() => onDelete?.(id)}>
      <span class="text-destructive">Delete</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>