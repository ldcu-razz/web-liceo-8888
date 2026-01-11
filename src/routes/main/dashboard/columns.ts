import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import NameCell from '$lib/components/common/NameCell.svelte';
import type { GetTicket } from '$lib/models/tickets/tickets.type';
import TicketPriorityBadge from '$lib/components/common/TicketPriorityBadge.svelte';
import TicketStatusBadge from '$lib/components/common/TicketStatusBadge.svelte';
import AssignedUserBadge from '$lib/components/common/AssignedUserBadge.svelte';
import AssignedDepartmentBadge from '$lib/components/common/AssignedDepartmentBadge.svelte';

export function createColumns(onView?: (id: string) => void): ColumnDef<GetTicket>[] {
	return [
		{
			header: 'Code',
			accessorKey: 'name',
			cell: ({ row }) => {
				return renderComponent(NameCell, {
					name: row.original.code,
					id: row.original.id,
					onView
				});
			}
		},
		{
			header: 'Title',
			accessorKey: 'title',
			cell: ({ row }) => {
				return renderComponent(NameCell, { name: row.original.title, id: row.original.id, onView });
			}
		},
		{
			header: 'Priority',
			accessorKey: 'priority',
			cell: ({ row }) => {
				return renderComponent(TicketPriorityBadge, {
					selectedPriority: row.original.priority,
					disabled: true
				});
			}
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: ({ row }) => {
				return renderComponent(TicketStatusBadge, {
					selectedStatus: row.original.status,
					size: 'sm',
					disabled: true
				});
			}
		},
		{
			header: 'Department',
			accessorKey: 'current_department_assigned',
			cell: ({ row }) => {
				return renderComponent(AssignedDepartmentBadge, {
					selectedDepartmentId: row.original.current_department_assigned?.id ?? '',
					showOptions: false
				});
			}
		},
		{
			header: 'Reported by',
			accessorKey: 'reported_by',
			cell: ({ row }) => {
				return renderComponent(AssignedUserBadge, {
					selectedUserId: row.original.reported_by?.id ?? '',
					showOptions: false
				});
			}
		},
		{
			header: 'Create At',
			accessorKey: 'createdAt',
			cell: ({ row }) => {
				return new Date(row.original.createdAt).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: true
				});
			}
		}
	];
}

// Keep default export for backward compatibility
export const columns = createColumns();
