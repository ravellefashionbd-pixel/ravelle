import type {
  StatCard,
  Order,
  Product,
  ActivityItem,
  RevenueDay,
} from "@/../types/adminTypes";

export const statCards: StatCard[] = [
  { label: "REVENUE · BDT", value: "4,82,350", change: 12.4 },
  { label: "ORDERS", value: "184", change: 8.1 },
  { label: "AVG. ORDER VALUE", value: "2,621", change: -2.3 },
  { label: "ACTIVE CUSTOMERS", value: "1,047", change: 19.6 },
];

export const recentOrders: Order[] = [
  { id: "#LC-4481", category: "JEWELLERY", amount: 8400, status: "SHIPPED" },
  { id: "#LC-4480", category: "PERFUME", amount: 3200, status: "PROCESSING" },
  { id: "#LC-4479", category: "COSMETICS", amount: 1850, status: "DELIVERED" },
  { id: "#LC-4478", category: "WATCHES", amount: 24500, status: "SHIPPED" },
  { id: "#LC-4477", category: "JEWELLERY", amount: 6100, status: "DELIVERED" },
];

export const topProducts: Product[] = [
  { name: "Lumière Eau de Parfum", category: "PERFUME", unitsSold: 142 },
  { name: "Midnight Rose Face Serum", category: "COSMETICS", unitsSold: 98 },
  { name: "Aurum Chain Bracelet", category: "JEWELLERY", unitsSold: 61 },
  { name: "Soleil Tourbillon Watch", category: "WATCHES", unitsSold: 29 },
];

export const activityItems: ActivityItem[] = [
  { message: "New order #LC-4481 placed — Jewellery", time: "2 MIN AGO" },
  { message: "Stock low: Lumière EDP — 4 units left", time: "18 MIN AGO" },
  { message: "Order #LC-4477 marked delivered", time: "1 HR AGO" },
  { message: "New customer registered — Dhaka", time: "3 HR AGO" },
  { message: "Product updated: Aurum Chain Bracelet", time: "YESTERDAY" },
];

export const revenueData: RevenueDay[] = [
  { day: "M", value: 42000 },
  { day: "T", value: 58000 },
  { day: "W", value: 51000 },
  { day: "T", value: 67000 },
  { day: "F", value: 74000 },
  { day: "S", value: 88000 },
  { day: "S", value: 95000 },
];
