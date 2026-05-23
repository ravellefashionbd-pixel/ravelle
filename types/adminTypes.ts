// ─── Dashboard Stat Card ───────────────────────────────────────────────────
export interface StatCard {
  label: string;
  value: string;
  change: number;
}

// ─── Dashboard Recent Order (for display only, simplified) ─────────────────
export interface DashboardOrder {
  id: string;
  category: string;
  amount: number;
  status: "SHIPPED" | "PROCESSING" | "DELIVERED";
}

// ─── Dashboard Top Product (for display only, simplified) ──────────────────
export interface DashboardProduct {
  name: string;
  category: string;
  unitsSold: number;
}

// ─── Activity Feed ─────────────────────────────────────────────────────────
export interface ActivityItem {
  message: string;
  time: string;
}

// ─── Revenue Chart ─────────────────────────────────────────────────────────
export interface RevenueDay {
  day: string;
  value: number;
}
