import { BaseStatusEnumSchema } from "$lib/models/common/common.schema.js";
import type { Departments } from "$lib/models/departments/departments.type";
import { supabase } from "$lib/supabase/client";

export const PUT = async ({ request }) => {
  const body = await request.json();
  const { id: _id, ...updateData } = body;

  const { data, error } = await supabase
    .from('departments')
    .update({ ...updateData })
    .eq('id', _id)
    .select()
    .single()
    .overrideTypes<Departments>();
    
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const DELETE = async ({ params }) => {
  const { id } = params;
  const { error } = await supabase.from('departments').update({ status: BaseStatusEnumSchema.enum.archived, updatedAt: new Date().toISOString() }).eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(true), { status: 200 });
}