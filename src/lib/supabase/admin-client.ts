import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$env/static/private';

/**
 * Admin client with service role key - bypasses RLS
 * ⚠️ ONLY use this on the server side (API routes, hooks)
 * NEVER expose this client to the client-side
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
