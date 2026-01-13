import { supabase } from '$lib/supabase/client';
import { TABLES } from '$lib/constants/tables.constants';
import type { GetUserProperties } from '$lib/models/users/user-properties.type';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params }: RequestEvent) => {
	const { id } = params;
	const { data, error } = await supabase
		.from(TABLES.USERS_PROPERTIES)
		.select('*')
		.eq('user_id', id)
		.single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const payloadData: GetUserProperties = data as GetUserProperties;

	return new Response(JSON.stringify(payloadData), { status: 200 });
};

export const PUT = async ({ params, request }: RequestEvent) => {
	const { id } = params;
	const body = await request.json();
	const { data, error } = await supabase
		.from(TABLES.USERS_PROPERTIES)
		.update(body)
		.eq('user_id', id)
		.select('*')
		.single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const payloadData: GetUserProperties = data as GetUserProperties;

	return new Response(JSON.stringify(payloadData), { status: 200 });
};
