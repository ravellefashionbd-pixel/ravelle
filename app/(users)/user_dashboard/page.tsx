import { createClient as ServerClient } from "@/../lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import DashboardClient from "@/../components/user-dashboard/DashboardClient";

export default async function DashboardPage() {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <DashboardClient
      userData={
        profile
          ? {
              ...profile,
              email: user.email ?? "",
            }
          : null
      }
    />
  );
}
