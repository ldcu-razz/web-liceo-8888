import { supabase } from "$lib/supabase/client";
import { TABLES } from "$lib/constants/tables.constants";
import { UserRolesEnumSchema } from "$lib/models/users/users.schema";

export const GET = async () => {
  const { count, error } = await supabase.from(TABLES.USERS).select('*', { count: 'exact', head: true }).eq('role', UserRolesEnumSchema.enum.user);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ count }), { status: 200 });
};  