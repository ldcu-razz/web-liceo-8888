import { supabase } from "$lib/supabase/client";
import { SessionSchema, UpdateSessionTokenSchema } from "$lib/models/session/session.schema";

export const POST = async ({ request }) => {
  const body = await request.json();
  const sessionData = SessionSchema.parse(body);
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const DELETE = async ({ request }) => {
  const body = await request.json();
  const { sessionId } = body;

  await supabase
    .from('sessions')
    .update({ is_revoked: true, updatedAt: new Date().toISOString() })
    .eq('id', sessionId);

  return new Response(JSON.stringify(true), { status: 200 });
}

export const PUT = async ({ request }) => {
  const body = await request.json();
  const { id, access_token, refresh_token, expiredAt } = UpdateSessionTokenSchema.parse(body);

  const { error } = await supabase
    .from('sessions')
    .update({
      access_token,
      refresh_token,
      expiredAt,
      updatedAt: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(true), { status: 200 });
}