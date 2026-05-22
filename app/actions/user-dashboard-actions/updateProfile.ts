"use server";

import { z } from "zod";
import { createClient as ServerClient } from "@/../lib/supabase/supabaseServer";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const profileSchema = z.object({
  full_name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
  phone: z
    .string()
    .max(15, "Phone number too long")
    .optional()
    .or(z.literal("")),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (!file || !(file instanceof File) || file.size === 0) return true;
      return file.size <= MAX_FILE_SIZE;
    }, "Max image size is 20MB.")
    .refine((file) => {
      if (!file || !(file instanceof File) || file.size === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export const updateProfile = async (formData: FormData) => {
  const supabase = await ServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: "Unauthorized!" };

  const rawData = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    image: formData.get("image"),
  };

  const validatedFields = profileSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    };
  }

  const { full_name, phone, image } = validatedFields.data;

  const updateData: {
    full_name: string;
    phone?: string;
    updated_at: string;
    avatar_url?: string;
  } = {
    full_name,
    phone,
    updated_at: new Date().toISOString(),
  };

  // UPLOAD IMAGE IN STORAGE
  if (image && image instanceof File && image.size > 0) {
    const fileExt = image.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles_image")
      .upload(fileName, image);

    if (uploadError) return { success: false, message: "Image upload failed!" };

    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles_image").getPublicUrl(fileName);

    updateData.avatar_url = publicUrl;
  }

  // UPDATE DATABASE
  const { error } = await supabase
    .from("profiles") // ← users → profiles
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Profile updated successfully!" };
};
