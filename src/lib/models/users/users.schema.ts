import z from 'zod';
import {
	BaseStatusEnumSchema,
	PaginatedSchema,
	SexEnumSchema,
	UUIDSchema
} from '../common/common.schema';
import { DepartmentsSchema } from '../departments/departments.schema';
import { UserPropertiesSchema } from './user-properties.schema';

export const UserRolesEnumSchema = z.enum(['super_admin', 'admin', 'user', 'department_staff']);

export const UserStatusEnumSchema = BaseStatusEnumSchema;

export const UsersSchema = z.object({
	id: UUIDSchema,
	rfid_number: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	sex: SexEnumSchema,
	birthdate: z.string(),
	email: z.string(),
	contact_number: z.string(),
	username: z.string(),
	password: z.string(),
	role: UserRolesEnumSchema,
	department_id: UUIDSchema,
	status: UserStatusEnumSchema,
	avatar: z.string().optional(),
	properties: UserPropertiesSchema.array(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export const GetUserSchema = UsersSchema.extend({
	department: DepartmentsSchema.pick({ id: true, name: true }),
	properties: UserPropertiesSchema.array()
});

export const PaginatedUsersSchema = PaginatedSchema.extend({
	data: z.array(UsersSchema)
});

export const PostUsersSchema = UsersSchema.omit({ properties: true });

export const PutUsersSchema = UsersSchema.partial();

export const DeleteUsersSchema = UsersSchema.pick({ id: true });

export const GetUserByUsernameResponseSchema = z.object({
	exists: z.boolean()
});

export const MentionedUsersSchema = UsersSchema.pick({
	id: true,
	firstname: true,
	lastname: true,
	username: true
});

export const TotalUsersSchema = z.object({
	count: z.number()
});