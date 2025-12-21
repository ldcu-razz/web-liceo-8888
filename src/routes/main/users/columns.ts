import type { ColumnDef } from "@tanstack/table-core";
import type { Users } from "$lib/models/users/users.type";
import { renderComponent } from "$lib/components/ui/data-table";
import NameCell from "$lib/components/common/NameCell.svelte";
import SexBadge from "$lib/components/common/SexBadge.svelte";
import UserRoleBadge from "$lib/components/common/UserRoleBadge.svelte";
import UsersDataTableActions from "./UsersDataTableActions.svelte";

export function createUsersTableColumns(onView?: (id: string) => void, onDelete?: (id: string) => void): ColumnDef<Users>[] {
  return [
    {
      header: "RFID #",
      accessorKey: "rfid_number",
      cell: ({ row }) => {
        const name = row.original.rfid_number;
        return renderComponent(NameCell, { name, id: row.original.id, onView });
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        const name = `${row.original.firstname} ${row.original.lastname}`;
        return renderComponent(NameCell, { name, id: row.original.id, onView });
      },
    },
    {
      header: "Sex",
      accessorKey: "sex",
      cell: ({ row }) => {
        return renderComponent(SexBadge, { sex: row.original.sex });
      },
    },
    {
      header: "Birthdate",
      accessorKey: "birthdate",
      cell: ({ row }) => {
        return new Date(row.original.birthdate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        return renderComponent(UserRoleBadge, { role: row.original.role });
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
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return renderComponent(UsersDataTableActions, { id: row.original.id, onView, onDelete });
      },
    },
  ];
}

export const columns = createUsersTableColumns();