import { renderComponent } from "$lib/components/ui/data-table";
import type { TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";
import type { ColumnDef } from "@tanstack/table-core";
import StatusBadge from "$lib/components/common/StatusBadge.svelte";
import TicketsCategoriesDataTableActions from "./TicketsCategoriesDataTableActions.svelte";
import NameCell from "$lib/components/common/NameCell.svelte";
import { get } from "svelte/store";
import { departmentsMap } from "$lib/store/departments.store";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";

export function createTicketsCategoriesColumns(onView?: (id: string) => void, onArchive?: (id: string) => void): ColumnDef<TicketCategories>[] {
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
      cell: ({ row }) => {
        const department = get(departmentsMap)[row.original.department_id ?? ''];
        return renderComponent(NameCell, { name: department?.abbv ?? '', id: row.original.id, onView });
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
        const disabledArchive = row.original.status === BaseStatusEnumSchema.enum.archived;
        return renderComponent(TicketsCategoriesDataTableActions, { id: row.original.id, disabledArchive, onView, onArchive });
      },
    },
  ];
}