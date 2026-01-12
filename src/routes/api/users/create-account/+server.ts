import { supabase } from '$lib/supabase/client';
import bcrypt from 'bcrypt';
import type { Users } from '$lib/models/users/users.type';
import { getAccountCreatedNotificationPayload } from '$lib/services/notifications/notifications.service';
import { UserRolesEnumSchema } from '$lib/models/users/users.schema.js';

export const POST = async ({ request }) => {
	const body = await request.json();
	const password = body.password;
	const hashedPassword = await bcrypt.hash(password, 10);
	const newBody = { ...body, password: hashedPassword };

	const { data, error } = await supabase.from('users').insert(newBody).select().single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const user = data as Users;

	const { data: superAdminUsersData, error: superAdminUsersError } = await supabase
		.from('users')
		.select('id')
		.eq('role', UserRolesEnumSchema.enum.super_admin);

	if (superAdminUsersError) {
		return new Response(JSON.stringify({ error: superAdminUsersError.message }), { status: 500 });
	}

	const superAdminUsers = superAdminUsersData as Users[];
	const notificationPayload = superAdminUsers.map((superAdminUser) =>
		getAccountCreatedNotificationPayload(user, superAdminUser.id)
	);
	const { error: notificationError } = await supabase
		.from('notifications')
		.insert(notificationPayload);

	if (notificationError) {
		return new Response(JSON.stringify({ error: notificationError.message }), { status: 500 });
	}

	return new Response(JSON.stringify(user), { status: 200 });
};
