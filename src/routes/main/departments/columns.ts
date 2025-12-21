import { renderComponent } from "$lib/components/ui/data-table";
import type { Departments } from "$lib/models/departments/departments.type";
import type { ColumnDef } from "@tanstack/table-core";
import StatusBadge from "$lib/components/common/StatusBadge.svelte";
import DepartmentsDataTableActions from "./DepartmentsDataTableActions.svelte";
import KeywordsCell from "./KeywordsCell.svelte";
import NameCell from "./NameCell.svelte";

export function createColumns(onView?: (id: string) => void, onDelete?: (id: string) => void): ColumnDef<Departments>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return renderComponent(NameCell, { name: row.original.name, id: row.original.id, onView });
      },
    },
    {
      header: "Abbv.",
      accessorKey: "abbv",
    },
    {
      header: "Keywords",
      accessorKey: "keywords",
      cell: ({ row }) => {
        return renderComponent(KeywordsCell, { keywords: row.original.keywords });
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return renderComponent(StatusBadge, { status: row.original.status });
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return renderComponent(DepartmentsDataTableActions, { id: row.original.id, onView, onDelete });
      },
    },
  ];
}

// Keep default export for backward compatibility
export const columns = createColumns();