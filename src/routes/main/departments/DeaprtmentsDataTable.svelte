<script lang="ts" module>
  import type { Departments } from "$lib/models/departments/departments.type";
  import { type ColumnDef, getCoreRowModel, getPaginationRowModel, type PaginationState } from "@tanstack/table-core";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table";
	import { Loader } from "@lucide/svelte";
	import { Pagination, PaginationEllipsis, PaginationLink, PaginationNextButton } from "$lib/components/ui/pagination";
	import PaginationContent from "$lib/components/ui/pagination/pagination-content.svelte";
	import PaginationItem from "$lib/components/ui/pagination/pagination-item.svelte";
	import PaginationPrevButton from "$lib/components/ui/pagination/pagination-prev-button.svelte";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
  };
</script>

<script lang="ts">

  let { columns, data, loading = $bindable(false) }: DataTableProps<Departments, unknown> = $props();

  let pagination = $state<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  
  let emptyData = $derived(data.length === 0);

  let dataLength = $derived(data.length);

  const table = createSvelteTable({
    get data() {
      return data;
    },
    get columns() {
      return columns;
    },
    state: {
      get pagination() {
        return pagination;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
    const maxVisible = 6;
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage <= 2) {
        // Near the beginning: show 1, 2, 3, 4
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // Near the end: show last 5 pages
        pages.push('ellipsis');
        for (let i = totalPages - 5; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: show current page and neighbors
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      }
    }

    return pages;
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
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      <Pagination count={dataLength} page={pagination.pageIndex + 1} onPageChange={(page) => table.setPageIndex(page - 1)} class="w-fit">
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
    <!-- <div class="flex items-center justify-between">
      <div class="text-muted-foreground flex-1 text-sm">
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      <div class="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onclick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <div class="flex items-center space-x-1">
          {#each getPageNumbers(pagination.pageIndex, table.getPageCount()) as pageNum, index (index)}
            {#if pageNum === 'ellipsis'}
              <span class="px-2 text-muted-foreground">...</span>
            {:else}
              <Button
                variant={pageNum === pagination.pageIndex ? "default" : "outline"}
                size="sm"
                onclick={() => table.setPageIndex(pageNum)}
              >
                {pageNum + 1}
              </Button>
            {/if}
          {/each}
        </div>
        <Button
          variant="outline"
          size="sm"
          onclick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div> -->
  {/if}
</div>