import type { Departments } from "$lib/models/departments/departments.type";
import { supabase } from "$lib/supabase/client";

export const GET = async () => {
  const { data, error } = await supabase.from('departments').select('*').order('createdAt', { ascending: false }).overrideTypes<Departments>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const { data, error } = await supabase.from('departments').insert(body).select().single().overrideTypes<Departments>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}