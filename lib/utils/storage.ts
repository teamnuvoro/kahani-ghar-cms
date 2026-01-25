import { createClient } from "@/lib/supabase/client";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function uploadImage(
  file: File,
  folder: "covers" | "slides"
): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${generateUUID()}.${fileExt}`;
  const filePath = `stories/${folder}/${fileName}`;

  const { error, data } = await supabase.storage
    .from("stories")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("stories").getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadAudio(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${generateUUID()}.${fileExt}`;
  const filePath = `stories/audio/${fileName}`;

  const { error, data } = await supabase.storage
    .from("stories")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("stories").getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const supabase = createClient();
  
  // Extract the file path from the URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split("/");
  const bucketIndex = pathParts.findIndex((part) => part === "stories");
  
  if (bucketIndex === -1) {
    throw new Error("Invalid file URL");
  }
  
  const filePath = pathParts.slice(bucketIndex + 1).join("/");

  const { error } = await supabase.storage
    .from("stories")
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
