import { supabase } from "$lib/supabase/client";
import { SessionSchema, UpdateSessionTokenSchema } from "$lib/models/session/session.schema";
import type { GetSessionsPaginated } from "$lib/models/session/session.type";
import { TABLES } from "$lib/constants/tables.constants.js";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 20;

  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .select('*')
    .range((page - 1) * size, page * size - 1)
    .order('createdAt', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  
  const { count, error: countError } = await supabase.from(TABLES.SESSIONS).select('*', { count: 'exact', head: true });
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }

  const payloadData: GetSessionsPaginated = {
    data,
    count: count || 0,
    page,
    size,
  };

  return new Response(JSON.stringify(payloadData), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const sessionData = SessionSchema.parse(body);
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
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
    .from(TABLES.SESSIONS)
    .update({ is_revoked: true, updatedAt: new Date().toISOString() })
    .eq('id', sessionId);

  return new Response(JSON.stringify(true), { status: 200 });
}

export const PUT = async ({ request }) => {
  const body = await request.json();
  const { id, access_token, refresh_token, expiredAt } = UpdateSessionTokenSchema.parse(body);

  const { error } = await supabase
    .from(TABLES.SESSIONS)
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