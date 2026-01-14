import { supabase } from '$lib/supabase/client';
import type { GetUser } from '$lib/models/users/users.type';
import type { RequestEvent } from '@sveltejs/kit';
import { TABLES } from '$lib/constants/tables.constants';

export const GET = async ({ locals }: RequestEvent) => {
	try {
		// Get user info from locals (set by hooks.server.ts)
		const user = locals.user;

		if (!user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
		}

		// Fetch full user data from database
		const { data, error } = await supabase
			.from('users')
			.select(
				`
				*,
				properties:user_properties(*)
				department:${TABLES.DEPARTMENTS}!department_id(*)
			`
			)
			.eq('id', user.userId)
			.single()
			.overrideTypes<GetUser>();

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500 });
		}

		if (!data) {
			return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
		}

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error('Error fetching current user:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
};
