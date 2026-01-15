import type { ColumnDef } from '@tanstack/table-core';
import type { Users } from '$lib/models/users/users.type';
import { renderComponent } from '$lib/components/ui/data-table';
import NameCell from '$lib/components/common/NameCell.svelte';
import SexBadge from '$lib/components/common/SexBadge.svelte';
import UserRoleBadge from '$lib/components/common/UserRoleBadge.svelte';
import UsersDataTableActions from './UsersDataTableActions.svelte';
import { BaseStatusEnumSchema } from '$lib/models/common/common.schema';
import StatusBadge from '$lib/components/common/StatusBadge.svelte';

export function createUsersTableColumns(
	onView?: (id: string) => void,
	onArchive?: (id: string) => void
): ColumnDef<Users>[] {
	return [
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row }) => {
				const name = `${row.original.firstname} ${row.original.lastname}`;
				return renderComponent(NameCell, {
					name,
					id: row.original.id,
					avatar: row.original.avatar,
					showAvatar: true,
					onView
				});
			}
		},
		{
			header: 'RFID #',
			accessorKey: 'rfid_number',
			cell: ({ row }) => {
				const name = row.original.rfid_number;
				return renderComponent(NameCell, { name, id: row.original.id, onView });
			}
		},
		{
			header: 'Sex',
			accessorKey: 'sex',
			cell: ({ row }) => {
				return renderComponent(SexBadge, { sex: row.original.sex });
			}
		},
		{
			header: 'Email',
			accessorKey: 'email'
		},
		{
			header: 'Role',
			accessorKey: 'role',
			cell: ({ row }) => {
				return renderComponent(UserRoleBadge, { role: row.original.role });
			}
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: ({ row }) => {
				return renderComponent(StatusBadge, { status: row.original.status });
			}
		},
	{
		header: 'Updated At',
		accessorKey: 'updatedAt',
		cell: ({ row }) => {
			const date = new Date(row.original.updatedAt);
			const month = date.toLocaleString('en-US', { month: 'short' });
			const day = date.getDate();
			const year = date.getFullYear();
			const time = date
				.toLocaleString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					hour12: true
				})
				.replace(' ', '');
			return `${month} ${day}, ${year} ${time}`;
		}
	},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: ({ row }) => {
				const disabledArchiveButton =
					row.original.status === BaseStatusEnumSchema.enum.archived ||
					row.original.status === BaseStatusEnumSchema.enum.inactive;
				return renderComponent(UsersDataTableActions, {
					id: row.original.id,
					disabledArchiveButton: disabledArchiveButton || false,
					onView,
					onArchive
				});
			}
		}
	];
}

export const columns = createUsersTableColumns();
