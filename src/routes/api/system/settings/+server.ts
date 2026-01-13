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

export const PUT = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const { data, error } = await supabase
		.from(TABLES.SYSTEM_SETTINGS)
		.update(body)
		.select('*')
		.single();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const payloadData: SystemSettings = data as SystemSettings;

	return new Response(JSON.stringify(payloadData), { status: 200 });
};
