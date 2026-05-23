"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Search } from "lucide-react";
import { createClient } from "@/../lib/supabase/supabaseClient";

type CustomerRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  orderCount: number;
  totalSpent: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchCustomers() {
      // Fetch profiles (non-admin users)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone, avatar_url, created_at")
        .eq("is_admin", 0)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!profiles) {
        setLoading(false);
        return;
      }

      // For each profile, fetch their order count and total spent
      const enriched = await Promise.all(
        profiles.map(async (profile) => {
          const { data: orders } = await supabase
            .from("orders")
            .select("total_amount")
            .eq("user_id", profile.id);

          const orderCount = orders?.length ?? 0;
          const totalSpent =
            orders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0;

          return { ...profile, orderCount, totalSpent };
        }),
      );

      setCustomers(enriched);
      setLoading(false);
    }

    fetchCustomers();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">
            CATALOGUE
          </h2>
          <h1 className="text-2xl font-light tracking-wider text-black">
            Customers
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-black/20 text-[10px] tracking-[0.2em] text-black/60 hover:bg-black/5 transition">
          <Search size={12} /> SEARCH
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-black/8 p-5 animate-pulse h-40"
            />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 text-[10px] tracking-widest text-black/30">
          NO CUSTOMERS YET
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map((c) => {
            const initials = (c.full_name ?? "?")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={c.id}
                className="bg-white border border-black/8 p-5 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black/5 border border-black/10 flex items-center justify-center text-[10px] tracking-widest text-black/50 overflow-hidden rounded-full">
                    {c.avatar_url ? (
                      <img
                        src={c.avatar_url}
                        alt={c.full_name ?? "avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.15em] text-black font-medium">
                      {c.full_name ?? "Unknown"}
                    </p>
                    <p className="text-[9px] tracking-[0.1em] text-black/40">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {c.phone && (
                    <div className="flex items-center gap-2 text-[10px] text-black/50">
                      <Phone size={11} strokeWidth={1.5} /> {c.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-black/30 italic">
                    <Mail size={11} strokeWidth={1.5} /> (email via auth)
                  </div>
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t border-black/8">
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-black/30">
                      ORDERS
                    </p>
                    <p className="text-sm font-medium text-black mt-0.5">
                      {c.orderCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-black/30">
                      TOTAL SPENT
                    </p>
                    <p className="text-sm font-medium text-black mt-0.5">
                      ৳ {c.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
