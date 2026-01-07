import { TABLES } from "$lib/constants/tables.constants";
import { supabase } from "$lib/supabase/client";

export const POST = async ({ request }) => {
  const body = await request.json();
  const { username, userId } = body;

  const { data: updatedUser, error: updateError } = await supabase
    .from(TABLES.USERS)
    .update({ username })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  if (!updatedUser) {
    return new Response(JSON.stringify({ error: 'Failed: No user found' }), { status: 500 });
  }

  return new Response(JSON.stringify(updatedUser), { status: 200 });
}