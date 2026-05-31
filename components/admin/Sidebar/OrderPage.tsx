"use client";

import { useEffect, useState } from "react";
import { Filter, Plus, MoreHorizontal } from "lucide-react";
import { createClient } from "@/../lib/supabase/supabaseClient";
import type { Tables } from "@/../types/database.types";

type Order = Tables<"orders">;

type DisplayStatus =
  | "DELIVERED"
  | "SHIPPED"
  | "PENDING"
  | "CANCELLED"
  | "PROCESSING";

const statusStyle: Record<DisplayStatus, string> = {
  DELIVERED: "bg-emerald-50 text-emerald-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  PENDING: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-600",
  PROCESSING: "bg-purple-50 text-purple-700",
};

function normalizeStatus(s: string): DisplayStatus {
  const upper = s.toUpperCase() as DisplayStatus;
  return upper in statusStyle ? upper : "PENDING";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">
            MANAGE
          </h2>
          <h1 className="text-2xl font-light tracking-wider text-black">
            Orders
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-black/20 text-[10px] tracking-[0.2em] text-black/60 hover:bg-black/5 transition">
            <Filter size={12} /> FILTER
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] tracking-[0.2em] hover:bg-black/80 transition">
            <Plus size={12} /> NEW ORDER
          </button>
        </div>
      </div>

      <div className="bg-white border border-black/8 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-[10px] tracking-widest text-black/30">
            LOADING...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-[10px] tracking-widest text-black/30">
            NO ORDERS YET
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-black/8">
                {[
                  "ORDER ID",
                  "CUSTOMER",
                  "PHONE",
                  "AMOUNT",
                  "STATUS",
                  "DATE",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[9px] tracking-[0.3em] text-black/40 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const status = normalizeStatus(o.status);
                return (
                  <tr
                    key={o.id}
                    className="border-b border-black/5 hover:bg-black/[0.02] transition"
                  >
                    <td className="px-4 py-3 text-[10px] tracking-wider text-black/70">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-black">
                      {o.customer_name}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-black/60">
                      {o.customer_phone}
                    </td>
                    <td className="px-4 py-3 text-[11px] font-medium text-black">
                      ৳ {o.total_amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-[9px] tracking-[0.15em] ${statusStyle[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-black/40">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-black/30 hover:text-black transition">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
