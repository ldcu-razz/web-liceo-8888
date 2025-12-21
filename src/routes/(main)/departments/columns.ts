import { renderComponent } from "$lib/components/ui/data-table";
import type { Departments } from "$lib/models/departments/departments.type";
import type { ColumnDef } from "@tanstack/table-core";
import StatusBadge from "$lib/components/common/StatusBadge.svelte";
import DepartmentsDataTableActions from "./DepartmentsDataTableActions.svelte";
import KeywordsCell from "./KeywordsCell.svelte";

export const columns: ColumnDef<Departments>[] = [
  {
    header: "Name",
    accessorKey: "name",
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
      return renderComponent(DepartmentsDataTableActions, { id: row.original.id });
    },
  },
];