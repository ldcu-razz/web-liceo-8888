import { renderComponent } from "$lib/components/ui/data-table";
import type { Departments } from "$lib/models/departments/departments.type";
import type { ColumnDef } from "@tanstack/table-core";
import StatusBadge from "$lib/components/common/StatusBadge.svelte";
import DepartmentsDataTableActions from "./DepartmentsDataTableActions.svelte";
import KeywordsCell from "./KeywordsCell.svelte";
import NameCell from "./NameCell.svelte";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";

export function createColumns(onView?: (id: string) => void, onArchive?: (id: string) => void): ColumnDef<Departments>[] {
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
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => {
        return new Date(row.original.updatedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const disabledArchive = row.original.status === BaseStatusEnumSchema.enum.archived;
        return renderComponent(DepartmentsDataTableActions, { id: row.original.id, disabledArchive, onView, onArchive });
      },
    },
  ];
}

// Keep default export for backward compatibility
export const columns = createColumns();