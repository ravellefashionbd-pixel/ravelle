"use server";

import { z } from "zod";
import { createClient as serverClient } from "@/../lib/supabase/supabaseServer";
import isDisposable from "disposable-email-detector";
import { headers } from "next/headers";
import { isRateLimited } from "@/../lib/utils/auth/rateLimits";
import { verifyTurnstile } from "@/../lib/utils/auth/captcha";

//ZOD VALIDATION
const validationData = z
  .object({
    fullName: z.string().min(1, "Name is Missing!"),
    email: z.string().email("Invalid email address!"),
    password: z.string().min(8, "Password must be at least 8 characters!"),
    confirmPassword: z.string().min(1, "Confirm password is missing!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

//CREATE USER FUNCTION
export const createUser = async (formData: FormData) => {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return {
      success: false,
      message:
        "Too many registration attempts. Please try again after an hour.",
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const result = validationData.safeParse(rawData);

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

  //INSERT DATABASE
  const { fullName, email, password } = result.data;
  const isDisposableEmail = await isDisposable(email);
  if (isDisposableEmail) {
    return {
      success: false,
      message:
        "Temporary or disposable emails are not allowed. Use a permanent email.",
    };
  }

  const supabase = await serverClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.log(error.message);
    return {
      success: false,
      message: "Something Went wrong!",
    };
  }

  return {
    success: true,
    message: "Verify your email!",
  };
};
