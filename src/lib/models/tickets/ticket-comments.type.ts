import type z from 'zod';
import type {
	GetTicketCommentsPaginatedSchema,
	PostTicketCommentSchema,
	DeleteTicketCommentSchema,
	PutTicketCommentSchema,
	TicketCommentsSchema,
	GetTicketCommentSchema
} from './ticket-comments.schema';

export type TicketComment = z.infer<typeof TicketCommentsSchema>;
export type GetTicketComment = z.infer<typeof GetTicketCommentSchema>;
export type GetTicketCommentsPaginated = z.infer<typeof GetTicketCommentsPaginatedSchema>;
export type PostTicketComment = z.infer<typeof PostTicketCommentSchema>;
export type PutTicketComment = z.infer<typeof PutTicketCommentSchema>;
export type DeleteTicketComment = z.infer<typeof DeleteTicketCommentSchema>;
