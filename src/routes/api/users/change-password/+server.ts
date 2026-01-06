import { TABLES } from "$lib/constants/tables.constants.js";
import type { Users } from "$lib/models/users/users.type";
import { supabase } from "$lib/supabase/client";
import bcrypt from "bcrypt";

export const POST = async ({ request }) => {
  const body = await request.json();
  const { currentPassword, newPassword, userId } = body;

  const { data: userData, error: userError } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 500 });
  }

  if (!userData) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  
  const user = userData as Users;
  const currentPasswordHash = user.password;
  const isPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: 'The current password is incorrect' }), { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { data: updatedUser, error: updateError } = await supabase
    .from(TABLES.USERS)
    .update({ password: hashedPassword })
    .eq('id', userId)
    .select()
    .single();
    
  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }
  
  if (!updatedUser) {
    return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
  }
  
  return new Response(JSON.stringify(true), { status: 200 });
}