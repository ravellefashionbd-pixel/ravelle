import { redirect } from "next/navigation";

import { createClient as ServerClient } from "@/../lib/supabase/supabaseServer";
import AdminDashboard from "../../../components/admin/dashboardAdmin";

export default async function Page() {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // profiles table has: id, full_name, phone, is_admin, avatar_url
  // email comes from auth user object
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, is_admin, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_admin !== 1) {
    redirect("/");
  }

  const userData = profile
    ? {
        id: profile.id,
        email: user.email ?? "",
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? undefined,
        image: profile.avatar_url ?? undefined,
        is_admin: profile.is_admin,
      }
    : null;

  return <AdminDashboard userData={userData} />;
}
