"use client";

import { useEffect, useState } from "react";
import StatCards from "@/../components/admin/StatsCard";
import RevenueChart from "@/../components/admin/RevenueChart";
import RecentOrders from "@/../components/admin/RecentOrders";
import TopProducts from "@/../components/admin/TopProducts";
import ActivityFeed from "@/../components/admin/ActivityFeed";
import { createClient } from "@/../lib/supabase/supabaseClient";
import type {
  StatCard,
  DashboardOrder,
  DashboardProduct,
} from "@/../types/adminTypes";

// Fallback static data for charts / activity (can be replaced with real data later)
import { activityItems, revenueData } from "@/../data/adminData";

export default function DashboardContent() {
  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [topProducts, setTopProducts] = useState<DashboardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDashboardData() {
      // ── Orders ──────────────────────────────────────────────────
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, customer_name")
        .order("created_at", { ascending: false })
        .limit(50);

      const allOrders = orders ?? [];
      const totalRevenue = allOrders.reduce((s, o) => s + o.total_amount, 0);

      // Recent 5 for the table
      const recent: DashboardOrder[] = allOrders.slice(0, 5).map((o) => ({
        id: `#${o.id.slice(0, 8).toUpperCase()}`,
        category: o.customer_name,
        amount: o.total_amount,
        status: normalizeStatus(o.status),
      }));

      // ── Products ────────────────────────────────────────────────
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_name, quantity");

      // Aggregate units sold per product name
      const salesMap: Record<string, number> = {};
      for (const item of orderItems ?? []) {
        salesMap[item.product_name] =
          (salesMap[item.product_name] ?? 0) + item.quantity;
      }
      const top: DashboardProduct[] = Object.entries(salesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, unitsSold]) => ({
          name,
          category: "—",
          unitsSold,
        }));

      // ── Profiles count ──────────────────────────────────────────
      const { count: customerCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_admin", 0);

      // ── Stat cards ──────────────────────────────────────────────
      const cards: StatCard[] = [
        {
          label: "TOTAL REVENUE",
          value: `৳ ${totalRevenue.toLocaleString()}`,
          change: 0,
        },
        {
          label: "TOTAL ORDERS",
          value: String(allOrders.length),
          change: 0,
        },
        {
          label: "CUSTOMERS",
          value: String(customerCount ?? 0),
          change: 0,
        },
        {
          label: "AVG ORDER VALUE",
          value:
            allOrders.length > 0
              ? `৳ ${Math.round(totalRevenue / allOrders.length).toLocaleString()}`
              : "৳ 0",
          change: 0,
        },
      ];

      setStatCards(cards);
      setRecentOrders(recent);
      setTopProducts(top);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-black/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-black/5" />
          <div className="h-48 bg-black/5" />
        </div>
      </div>
    );
  }

  return (
    <>
      <StatCards cards={statCards} />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <RecentOrders orders={recentOrders} />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        <TopProducts products={topProducts} />
        <ActivityFeed items={activityItems} />
      </div>
    </>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function normalizeStatus(s: string): DashboardOrder["status"] {
  const upper = s.toUpperCase();
  if (upper === "SHIPPED") return "SHIPPED";
  if (upper === "DELIVERED") return "DELIVERED";
  return "PROCESSING";
}
