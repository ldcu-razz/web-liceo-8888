import { PaginatedSchema, UUIDSchema } from "../common/common.schema";
import z from "zod";
import { MentionedUsersSchema, UsersSchema } from "../users/users.schema";

export const TicketCommentsSchema = z.object({
  id: UUIDSchema,
  ticket_id: UUIDSchema,
  comment: z.string(),
  mentioned_users: z.array(MentionedUsersSchema),
  is_visible_to_public: z.boolean(),
  created_by: UUIDSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetTicketCommentSchema = TicketCommentsSchema.extend({
  created_by: UsersSchema.pick({ id: true, firstname: true, lastname: true, username: true }),
});

export const PostTicketCommentSchema = TicketCommentsSchema;

export const PutTicketCommentSchema = TicketCommentsSchema.partial();

export const DeleteTicketCommentSchema = z.object({
  id: UUIDSchema,
});

export const GetTicketCommentsPaginatedSchema = PaginatedSchema.extend({
  data: z.array(GetTicketCommentSchema),
});