<script lang="ts" module>
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import { Loader } from '@lucide/svelte';
	import { departmentsPagination } from '$lib/store/departments.store';
	import type { GetTicket } from '$lib/models/tickets/tickets.type';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		loading?: boolean;
	};
</script>

<script lang="ts">
	let { columns, data, loading = $bindable(false) }: DataTableProps<GetTicket, unknown> = $props();

	let pagination = $derived($departmentsPagination);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="relative">
	{#if loading}
		<div class="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
			<Loader class="size-4 animate-spin" />
			<span class="ml-2 text-sm text-gray-500">Loading...</span>
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
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</TableHead>
						{/each}
					</TableRow>
				{/each}
			</TableHeader>
			<TableBody>
				{#each table.getRowModel().rows as row (row.id)}
					<TableRow data-state={row.getIsSelected() && 'selected'}>
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
</div>
