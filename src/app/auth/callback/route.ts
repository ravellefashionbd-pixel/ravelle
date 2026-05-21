import { createClient } from "@/lib/supabase/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();

    // verify email and set cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          return NextResponse.redirect(`${origin}/`);
        }

        if (profile?.role == 1) {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          const redirectUrl =
            next && next.startsWith("/")
              ? `${origin}${next}`
              : `${origin}/user_dashboard`;
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Verification failed`);
}
