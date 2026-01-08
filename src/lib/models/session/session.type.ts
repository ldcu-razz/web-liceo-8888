import type z from 'zod';
import type {
	GetSessionsPaginatedSchema,
	LoginPayloadSchema,
	LoginResponseSchema,
	LogoutResponseSchema,
	SessionSchema,
	TokenPayloadSchema
} from './session.schema';

export type Session = z.infer<typeof SessionSchema>;
export type GetSessionsPaginated = z.infer<typeof GetSessionsPaginatedSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
