import { BUCKETS } from '$lib/constants/buckets.constants';
import { supabase } from '$lib/supabase/client';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { path } = await request.json();

	if (!path) {
		return json({ error: 'path is required' }, { status: 400 });
	}

	// Generate signed URL valid for 1 hour
	const { data, error } = await supabase.storage.from(BUCKETS.FILES).createSignedUrl(path, 60 * 60); // 1 hour

	if (error || !data) {
		return json({ error: 'Failed to generate signed URL' }, { status: 500 });
	}

	return json({
		signedUrl: data.signedUrl,
		expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
	});
};
