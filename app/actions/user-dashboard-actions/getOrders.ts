"use server";

import { createClient } from "@/../lib/supabase/supabaseServer";

export const getOrders = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      created_at,
      order_items (
        product_name,
        quantity,
        unit_price,
        product_image,
        size,
        color
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };

  return { data, error: null };
};
