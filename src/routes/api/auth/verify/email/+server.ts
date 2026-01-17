import { VERIFICATION_TOKEN_SECRET } from "$env/static/private";
import { TABLES } from "$lib/constants/tables.constants";
import { UserStatusEnumSchema } from "$lib/models/users/users.schema.js";
import { sendEmailToUserWelcomeEmail } from "$lib/services/email/send-email.service";
import { supabase } from "$lib/supabase/client";
import jwt from 'jsonwebtoken';

export const POST = async ({ url }) => {
	const token = url.searchParams.get('token');
  
  if (!token) {
		return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
	}

  const decodedToken = jwt.verify(token, VERIFICATION_TOKEN_SECRET) as unknown as { user_id: string, user_properties_id: string, role: string, email: string };
  if (!decodedToken) {
		return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400 });
	}

  const { data: getUserPropertiesData, error: getUserPropertiesError } = await supabase.from(TABLES.USERS_PROPERTIES).select('*').eq('id', decodedToken.user_properties_id).single();
  if (getUserPropertiesError) {
		return new Response(JSON.stringify({ error: getUserPropertiesError.message }), { status: 500 });
	}
  
  if (!getUserPropertiesData) {
    return new Response(JSON.stringify({ error: 'User properties not found' }), { status: 400 });
  }

  if (getUserPropertiesData.verified_at) {
    return new Response(JSON.stringify({ error: 'Account already verified' }), { status: 400 });
  }

  const { data: userData, error: userError } = await supabase.from(TABLES.USERS).update({ status: UserStatusEnumSchema.enum.active }).eq('id', decodedToken.user_id).select('*').single();
  if (userError) {
		return new Response(JSON.stringify({ error: userError.message }), { status: 500 });
	}

	const { error: userPropertiesError } = await supabase.from(TABLES.USERS_PROPERTIES).update({ verified_at: new Date().toISOString() }).eq('id', decodedToken.user_properties_id);
	if (userPropertiesError) {
		return new Response(JSON.stringify({ error: userPropertiesError.message }), { status: 500 });
	}

	// Send email to user to welcome them
	const fullname = `${userData.firstname} ${userData.lastname}`;
	sendEmailToUserWelcomeEmail(fullname, decodedToken.email);

	return new Response(JSON.stringify(true), { status: 200 });
};