"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { createClient as supabaseClient } from "@/lib/supabase/supabaseClient";
import { useState } from "react";

import { useRef } from "react";
import Turnstile from "react-turnstile";
import { loginUser } from "../../actions/auth/login";
export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = supabaseClient();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  //HANDLE MANUAL LOGIN
  const handleManualLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    setIsPending(true);

    const formData = new FormData(formRef.current!);
    formData.append("cf-turnstile-response", captchaToken);
    const result = await loginUser(formData);

    if (result.success) {
      toast.success(result.message, {
        style: {
          background: "#ffffff",
          color: "#1a1410",
          border: "1px solid rgba(0,0,0,0.1)",
        },
        iconTheme: {
          primary: "#1a1410",
          secondary: "#ffffff",
        },
      });

      setIsPending(false);

      formRef.current?.reset();
      setCaptchaToken(null);
    } else {
      toast.error(result.message, {
        style: {
          background: "#ffffff",
          color: "#1a1410",
          border: "1px solid rgba(0,0,0,0.15)",
        },
        iconTheme: {
          primary: "#000000",
          secondary: "#ffffff",
        },
      });
      setIsPending(false);
    }
  };
  //HANDLE GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        {/* CARD */}
        <div className="w-full max-w-md border border-gray-100 shadow-sm p-8 md:p-10">
          {/* TITLE */}
          <h1 className="text-center text-2xl uppercase tracking-widest font-light">
            Sign In
          </h1>

          <p className="text-center text-sm text-gray-400 mt-2 mb-8">
            Welcome back
          </p>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-4 h-4"
              alt="google"
            />
            Sign in with Google
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* FORM */}
          <form
            ref={formRef}
            onSubmit={handleManualLogin}
            className="space-y-5"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email"
                className="w-full mt-2 border-b border-gray-300 py-3 outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Password
              </label>
              <input
                type="password"
                required
                name="password"
                placeholder="Enter password"
                className="w-full mt-2 border-b border-gray-300 py-3 outline-none focus:border-black transition"
              />
            </div>

            {/* CAPTCHA */}
            <Turnstile
              sitekey="0x4AAAAAAC-_oNGSJuuZoEbY"
              onVerify={(token) => setCaptchaToken(token)}
            />

            {/*SUBMIT*/}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest
                transition-all duration-200
                active:scale-[0.98]
                active:bg-gray-900
                hover:bg-gray-900
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* LINKS */}
          <div className="flex justify-between mt-6 text-xs text-gray-500">
            <Link href="/forgot-password" className="hover:text-black">
              Forgot Password
            </Link>

            <Link href="/register" className="hover:text-black">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
