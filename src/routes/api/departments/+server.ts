import { TABLES } from "$lib/constants/tables.constants";
import type { Departments } from "$lib/models/departments/departments.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 15;
  const query = url.searchParams.get('q') || '';

  const { data, error } = await supabase.from(TABLES.DEPARTMENTS)
    .select('*')
    .order('createdAt', { ascending: false })
    .range((page - 1) * size, page * size - 1)
    .or(`name.ilike.%${query}%,abbv.ilike.%${query}%`)
    .overrideTypes<Departments>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { count, error: countError } = await supabase.from(TABLES.DEPARTMENTS).select('*', { count: 'exact', head: true });
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ data, count, page, size }), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const { data, error } = await supabase.from(TABLES.DEPARTMENTS).insert(body).select().single().overrideTypes<Departments>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}