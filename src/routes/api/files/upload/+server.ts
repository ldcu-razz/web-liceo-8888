import { BUCKETS } from "$lib/constants/buckets.constants";
import { TABLES } from "$lib/constants/tables.constants";
import type { PostFileProperties } from "$lib/models/files/files.type";
import { detectFileType } from "$lib/services/files/files.service";
import { supabase } from "$lib/supabase/client";
import { uuid } from "$lib/utils/uuid.util.js";

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const ownerId = formData.get("owner_id") as string | null;

  if (!file || !ownerId) {
    return new Response(JSON.stringify({ error: "file and owner_id are required" }), { status: 400 });
  }

  // Derive metadata from the file object
  const fileExt = file.name.split(".").pop() ?? "";
  const filePath = `${ownerId}/${uuid()}.${fileExt}`;

  const { data, error } = await supabase.storage.from(BUCKETS.FILES).upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKETS.FILES)
    .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10); // 10 years

  if (signedUrlError || !signedUrlData) {
    return new Response(JSON.stringify({ error: "Failed to generate file URL" }), { status: 500 });
  }

  const fileProperties: PostFileProperties = {
    id: uuid(),
    owner_id: ownerId,
    path: signedUrlData.signedUrl,
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