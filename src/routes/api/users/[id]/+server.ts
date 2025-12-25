import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
import type { Users } from "$lib/models/users/users.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ params }) => {
  const { id } = params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single().overrideTypes<Users>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const PUT = async ({ request, params }) => {
  const body = await request.json();
  const { id } = params;
  const { data, error } = await supabase.from('users').update(body).eq('id', id).select().single().overrideTypes<Users>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const DELETE = async ({ params }) => {
  const { id } = params;
  const { error } = await supabase.from('users').update({ status: BaseStatusEnumSchema.enum.archived, updatedAt: new Date().toISOString() }).eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(true), { status: 200 });
}