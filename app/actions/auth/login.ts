"use server";

import { createClient as supabaseServer } from "@/../lib/supabase/supabaseServer";
import { z } from "zod";

import { success } from "zod/mini";
import { verifyTurnstile } from "@/../lib/utils/auth/captcha";

const loginValidation = z.object({
  email: z.string().email("Invalid email address!"),
  password: z.string().min(1, "Password is required!"),
});

export const loginUser = async (formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  const result = loginValidation.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  //CAPTCHA VALIDATION
  const token = formData.get("cf-turnstile-response") as string;

  const isCaptchaValid = await verifyTurnstile(token);
  if (!isCaptchaValid) {
    return { success: false, message: "Captcha verification failed!" };
  }

  const { email, password } = result.data;
  const supabase = await supabaseServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: "Invalid email or password!",
    };
  }

  return {
    success: true,
    message: "Login successful!",
  };
};
