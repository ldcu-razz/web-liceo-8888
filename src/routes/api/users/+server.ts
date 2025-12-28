import { supabase } from "$lib/supabase/client";
import type { Users } from "$lib/models/users/users.type";
import bcrypt from "bcrypt";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 25;
  const query = url.searchParams.get('q') || '';
  const userRoles = url.searchParams.get('userRoles');
  const userRolesArray = userRoles ? userRoles.split(',') : [];

  let queryBuilder = supabase.from('users')
    .select('*')
    .order('createdAt', { ascending: false })

  if (size && page) {
    queryBuilder = queryBuilder.range((page - 1) * size, page * size - 1);
  }

  if (query) {
    queryBuilder = queryBuilder.or(`firstname.ilike.%${query}%,lastname.ilike.%${query}%,username.ilike.%${query}%`);
  }
  
  if (userRolesArray.length > 0) {
    queryBuilder = queryBuilder.in('role', userRolesArray);
  }

  const { data, error } = await queryBuilder.overrideTypes<Users>();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { count, error: countError } = await supabase.from('users').select('*', { count: 'exact', head: true });
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ data, count, page, size }), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const password = body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newBody = { ...body, password: hashedPassword };

  const { data, error } = await supabase.from('users').insert(newBody).select().single().overrideTypes<Users>();


  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}