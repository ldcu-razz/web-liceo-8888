import { TABLES } from "$lib/constants/tables.constants";
import { supabase } from "$lib/supabase/client";
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async ({ request }: RequestEvent) => {
  const { number_of_tickets_creation_limit } = await request.json();

  const { data, error } = await supabase
    .from(TABLES.USERS_PROPERTIES)
    .update({ remaining_tickets_creation: number_of_tickets_creation_limit })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Match all records
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const response = data ? { success: true } : { success: false };

  return new Response(JSON.stringify(response), { status: 200 });
};