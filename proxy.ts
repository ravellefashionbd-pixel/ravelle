import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // PROTECTED ROUTE
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // FIND USER ROLE
  let isAdmin = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.is_admin ?? 0;
  }

  const url = request.nextUrl.clone();

  // ADMIN DASHBOARD PROTECTION
  if (url.pathname.startsWith("/admin")) {
    if (!user || isAdmin !== 1) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // USER DASHBOARD PROTECTION
  if (url.pathname.startsWith("/user_dashboard")) {
    if (!user || !user.email_confirmed_at) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // IF ALREADY LOGGED IN
  if (user && (url.pathname === "/login" || url.pathname === "/register")) {
    url.pathname = isAdmin === 1 ? "/admin" : "/user_dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
