import { TABLES } from '$lib/constants/tables.constants.js';
import { GetUserByEmailResponseSchema } from '$lib/models/users/users.schema';
import { supabase } from '$lib/supabase/client';

export const GET = async ({ url }) => {
	const email = url.searchParams.get('email');
	const { count, error } = await supabase
		.from(TABLES.USERS)
		.select('*', { count: 'exact', head: true })
		.eq('email', email);

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const exists = count !== null && count > 0;
	const response = GetUserByEmailResponseSchema.parse({ exists });
	return new Response(JSON.stringify(response), { status: 200 });
};
