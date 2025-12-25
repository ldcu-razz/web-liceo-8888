import { GetUserByUsernameResponseSchema } from "$lib/models/users/users.schema";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ url }) => {
  const username = url.searchParams.get('username');
  const { data, error } = await supabase.from('users').select('username').eq('username', username).maybeSingle();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const exists = data !== null;
  const response = GetUserByUsernameResponseSchema.parse({ exists });
  return new Response(JSON.stringify(response), { status: 200 });
}