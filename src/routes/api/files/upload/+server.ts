import { BUCKETS } from "$lib/constants/buckets.constants";
import { TABLES } from "$lib/constants/tables.constants";
import type { PostFileProperties } from "$lib/models/files/files.type";
import { detectFileType } from "$lib/services/files/files.service";
import { supabase } from "$lib/supabase/client";
import { uuid } from "$lib/utils/uuid.util.js";

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const user_id = formData.get("user_id") as string | null;
  const ticket_id = formData.get("ticket_id") as string | null;
  const department_id = formData.get("department_id") as string | null;

  if (!file) {
    return new Response(JSON.stringify({ error: "file is required" }), { status: 400 });
  }

  if (!user_id && !ticket_id && !department_id) {
    return new Response(JSON.stringify({ error: "user_id, ticket_id, or department_id is required" }), { status: 400 });
  }

  // Derive metadata from the file object
  const fileExt = file.name.split(".").pop() ?? "";
  const id = user_id ?? ticket_id ?? department_id;
  const filePath = `${id}/${uuid()}.${fileExt}`;

  const { data, error } = await supabase.storage.from(BUCKETS.FILES).upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Store the storage path (not the URL) for dynamic URL generation
  const fileProperties: PostFileProperties = {
    id: uuid(),
    user_id: user_id,
    ticket_id: ticket_id,
    department_id: department_id,
    path: data.path, // Store storage path like "userId/uuid.ext"
    type: detectFileType(file.type, fileExt),
    size: file.size,
    extension: fileExt,
    mime_type: file.type,
    createdAt: new Date().toISOString(),
  };

  const { data: fileData, error: fileError } = await supabase.from(TABLES.FILES).insert(fileProperties).select().single();
  if (fileError) {
    return new Response(JSON.stringify({ error: fileError.message }), { status: 500 });
  }

  return new Response(JSON.stringify(fileData), { status: 200 });
};