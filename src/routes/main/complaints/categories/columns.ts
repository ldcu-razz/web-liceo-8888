import { renderComponent } from "$lib/components/ui/data-table";
import type { ComplaintsCategories } from "$lib/models/complaints/categories/complaints-categories.type";
import type { ColumnDef } from "@tanstack/table-core";
import StatusBadge from "$lib/components/common/StatusBadge.svelte";
import ComplaintsCategoriesDataTableActions from "./ComplaintsCategoriesDataTableActions.svelte";
import NameCell from "$lib/components/common/NameCell.svelte";

export function createComplaintsCategoriesColumns(onView?: (id: string) => void, onDelete?: (id: string) => void): ColumnDef<ComplaintsCategories>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return renderComponent(NameCell, { name: row.original.name, id: row.original.id, onView });
      },
    },
    {
      header: "Department",
      accessorKey: "default_department",
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
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
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
        return renderComponent(ComplaintsCategoriesDataTableActions, { id: row.original.id, onView, onDelete });
      },
    },
  ];
}