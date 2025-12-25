<script lang="ts" module>
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table";
	import { Loader } from "@lucide/svelte";
	import type { Users } from "$lib/models/users/users.type";
	import { usersActions, usersPagination, usersTotalCount } from "$lib/store/users.store";
	import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNextButton, PaginationPrevButton } from "$lib/components/ui/pagination";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
  };
</script>

<script lang="ts">

  let { columns, data, loading = $bindable(false) }: DataTableProps<Users, unknown> = $props();

  let pagination = $state($usersPagination);

  let totalCount = $derived($usersTotalCount);
  
  let emptyData = $derived(data.length === 0);

  const table = createSvelteTable({
    get data() {
      return data;
    },
    get columns() {
      return columns;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  async function handlePageChange(page: number) {
    await usersActions.getUsers({ page: page, size: pagination.size });
    table.setPageIndex(page);
  }
</script>

<div class="relative">
  {#if loading}
    <div class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
      <Loader class="size-4 animate-spin" />
      <span class="text-sm text-gray-500 ml-2">Loading...</span>
    </div>
  {/if}
  <div class="rounded-md border">
    <Table>
      <TableHeader class="bg-gray-100">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <TableRow>
            {#each headerGroup.headers as header (header.id)}
              <TableHead colspan={header.colSpan}> 
                {#if !header.isPlaceholder}
                  <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
                {/if}
              </TableHead>
            {/each}
          </TableRow>
        {/each}
      </TableHeader>
      <TableBody>
        {#each table.getRowModel().rows as row (row.id)}
          <TableRow data-state={row.getIsSelected() && "selected"}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <TableCell>
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </TableCell>
            {/each}
          </TableRow>
        {:else}
          <TableRow>
            <TableCell colspan={columns.length} class="h-24 text-center">
              No departments found.
            </TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>

  {#if !emptyData}
    <div class="flex items-center justify-between mt-4">
      <div class="text-muted-foreground flex-1 text-sm">
        Page {pagination.page} of {totalCount}
      </div>
      <Pagination count={totalCount} page={pagination.page} perPage={pagination.size} onPageChange={handlePageChange} class="w-fit">
        {#snippet children({ pages, currentPage })}
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevButton />
            </PaginationItem>

            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              {:else}
                <PaginationItem>
                  <PaginationLink page={page} isActive={currentPage === page.value}>
                    {page.value}
                  </PaginationLink>
                </PaginationItem>
              {/if}
            {/each}

            <PaginationItem>
              <PaginationNextButton />
            </PaginationItem>
          </PaginationContent>
        {/snippet}
      </Pagination>
    </div>
  {/if}
</div>