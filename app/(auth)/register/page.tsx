"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { createClient as supabaseClient } from "@/../lib/supabase/supabaseClient";
import { useRef } from "react";
import Turnstile from "react-turnstile";
import { createUser } from "../../actions/auth/registration";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const supabase = supabaseClient();
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // HANDLE MANUAL REGISTER
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }
    setIsPending(true);

    const formData = new FormData(formRef.current!);
    formData.append("cf-turnstile-response", captchaToken);
    const result = await createUser(formData);

    if (result.success) {
      toast.success(result.message, {
        duration: 8000,
        style: {
          border: "1px solid #000",
          padding: "16px",
          color: "#000",
        },
      });

      setIsPending(false);

      formRef.current?.reset();
      setPassword("");
      setConfirmPassword("");
      setCaptchaToken(null);
    } else {
      toast.error(result.message);
      setIsPending(false);
    }
  };

  //HANDLE GOOGLE LOGIN
  const handleGoogleSignup = async () => {
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

  const validations = [
    { label: "At least 8 characters", test: password.length >= 8 },
    { label: "At least one uppercase letter", test: /[A-Z]/.test(password) },
    { label: "At least one number", test: /[0-9]/.test(password) },
    {
      label: "At least one special character",
      test: /[!@#$%^&*]/.test(password),
    },
  ];

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-md border border-gray-100 shadow-sm p-8 md:p-10">
          <h1 className="text-center text-2xl uppercase tracking-widest font-light">
            Create Account
          </h1>

          <p className="text-center text-sm text-gray-400 mt-2 mb-8">Join us</p>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full border border-gray-300 py-3 text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-[0.98]"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-4 h-4"
              alt="google"
            />
            Sign up with Google
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="fullName"
              required
              placeholder="Full Name"
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition-all"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* VALIDATION LIS */}
            {password.length > 0 && (
              <div className="mt-4 space-y-2">
                {validations.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.test ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span
                      className={`text-[11px] uppercase tracking-wider ${item.test ? "text-green-600" : "text-gray-400"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CONFIRM PASSWORD*/}
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* CAPTCHA */}
            <Turnstile
              sitekey="0x4AAAAAAC-_oNGSJuuZoEbY"
              onVerify={(token) => setCaptchaToken(token)}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isPending || !captchaToken}
              className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest
                  mt-4
                  transition-all duration-200
                hover:bg-zinc-800
                  active:scale-[0.98]
                  active:brightness-90
                  disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have account?{" "}
            <Link
              href="/login"
              className="text-black font-semibold underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
