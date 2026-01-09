import { TicketsPrioritiesSchema, TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';

export const TICKET_CODE_PREFIX = 'LDCU';

export const TICKET_STATUS_COLOR_MAP = {
	[TicketStatusesSchema.enum.backlog]: {
		bgColor: 'bg-gray-100',
		textColor: 'text-gray-700',
		borderColor: 'border-gray-300'
	},
	[TicketStatusesSchema.enum.closed]: {
		bgColor: 'bg-green-100',
		textColor: 'text-green-700',
		borderColor: 'border-green-300'
	},
	[TicketStatusesSchema.enum.archived]: {
		bgColor: 'bg-red-100',
		textColor: 'text-red-700',
		borderColor: 'border-red-300'
	},
	[TicketStatusesSchema.enum.in_progress]: {
		bgColor: 'bg-blue-100',
		textColor: 'text-blue-700',
		borderColor: 'border-blue-300'
	},
	[TicketStatusesSchema.enum.done]: {
		bgColor: 'bg-green-100',
		textColor: 'text-green-700',
		borderColor: 'border-green-300'
	},
	[TicketStatusesSchema.enum.ready]: {
		bgColor: 'bg-yellow-100',
		textColor: 'text-yellow-700',
		borderColor: 'border-yellow-300'
	},
	[TicketStatusesSchema.enum.in_review]: {
		bgColor: 'bg-purple-100',
		textColor: 'text-purple-700',
		borderColor: 'border-purple-300'
	}
};

export const TICKET_PRIORITY_COLOR_MAP = {
	[TicketsPrioritiesSchema.enum.low]: {
		bgColor: 'bg-sky-100',
		textColor: 'text-sky-700',
		borderColor: 'border-sky-300'
	},
	[TicketsPrioritiesSchema.enum.medium]: {
		bgColor: 'bg-gray-100',
		textColor: 'text-gray-700',
		borderColor: 'border-gray-300'
	},
	[TicketsPrioritiesSchema.enum.high]: {
		bgColor: 'bg-amber-100',
		textColor: 'text-amber-700',
		borderColor: 'border-amber-300'
	},
	[TicketsPrioritiesSchema.enum.highest]: {
		bgColor: 'bg-rose-100',
		textColor: 'text-rose-700',
		borderColor: 'border-rose-300'
	},
	[TicketsPrioritiesSchema.enum.lowest]: {
		bgColor: 'bg-blue-100',
		textColor: 'text-blue-700',
		borderColor: 'border-blue-300'
	}
};
