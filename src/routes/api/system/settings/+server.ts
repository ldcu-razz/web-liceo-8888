import { TABLES } from '$lib/constants/tables.constants';
import type { SystemSettings } from '$lib/models/system/system-settings.type';
import { supabase } from '$lib/supabase/client';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async () => {
	const { data, error } = await supabase.from(TABLES.SYSTEM_SETTINGS).select('*').single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const payloadData: SystemSettings = data as SystemSettings;

	return new Response(JSON.stringify(payloadData), { status: 200 });
};

export const PUT = async ({ request, url }: RequestEvent) => {
	const id = url.searchParams.get('id');
	const body = await request.json();
	const { data, error } = await supabase
		.from(TABLES.SYSTEM_SETTINGS)
		.update(body)
		.eq('id', id)
		.select('*')
		.single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const payloadData: SystemSettings = data as SystemSettings;

	return new Response(JSON.stringify(payloadData), { status: 200 });
};
