import { supabase } from '$lib/supabase/client';
import bcrypt from 'bcrypt';
import type { Users } from '$lib/models/users/users.type';
import { getAccountCreatedNotificationPayload } from '$lib/services/notifications/notifications.service';
import { UserRolesEnumSchema } from '$lib/models/users/users.schema.js';
import { TABLES } from '$lib/constants/tables.constants.js';
import type { SystemSettings } from '$lib/models/system/system-settings.type';
import { sendEmailToUserVerifyEmail } from '$lib/services/email/send-email.service.js';
import jwt from 'jsonwebtoken';
import { VERIFICATION_TOKEN_SECRET } from '$env/static/private';
import { uuid } from '$lib/utils/uuid.util.js';

export const POST = async ({ request }) => {
	const body = await request.json();
	const password = body.password;
	const hashedPassword = await bcrypt.hash(password, 10);
	const newBody = { ...body, password: hashedPassword };

	const { data, error } = await supabase.from(TABLES.USERS).insert(newBody).select().single();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	const user = data as Users;


	const { data: systemSettingsData, error: systemSettingsError } = await supabase
		.from(TABLES.SYSTEM_SETTINGS)
		.select('*')
		.single();

	if (systemSettingsError) {
		return new Response(JSON.stringify({ error: systemSettingsError.message }), { status: 500 });
	}
	
	const systemSettingsTypedData = systemSettingsData as SystemSettings;
	
	const userPropertiesId = uuid();

	const vertificationToken = jwt.sign({ user_id: user.id, user_properties_id: userPropertiesId, role: user.role, email: user.email }, VERIFICATION_TOKEN_SECRET);

	// Set user properties
	const { error: userPropertiesError } = await supabase
		.from(TABLES.USERS_PROPERTIES)
		.insert({
			id: userPropertiesId,
			user_id: user.id,
			remaining_tickets_creation: systemSettingsTypedData.number_of_tickets_creation_limit,
			bypass_ticket_creation_limit: false,
			vertification_token: vertificationToken,
			verified_at: null
		})
		.select()
		.single();

	if (userPropertiesError) {
		return new Response(JSON.stringify({ error: userPropertiesError.message }), { status: 500 });
	}

	// Send email to user to verify email
	if (user.role === UserRolesEnumSchema.enum.user) {
		sendEmailToUserVerifyEmail(user, vertificationToken);
	}

	// Notifications for admin users
	const { data: superAdminUsersData, error: superAdminUsersError } = await supabase
		.from(TABLES.USERS)
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
		.from(TABLES.NOTIFICATIONS)
		.insert(notificationPayload);

	if (notificationError) {
		return new Response(JSON.stringify({ error: notificationError.message }), { status: 500 });
	}

	return new Response(JSON.stringify(user), { status: 200 });
};
