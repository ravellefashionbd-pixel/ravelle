"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Sidebar from "@/../components/admin/Sidebar";
import Topbar from "@/../components/admin/Topbar";
import { AnimatePresence } from "framer-motion";
import FadeIn from "@/../components/ui/FadeIn";
import AddProductForm from "@/../components/ui/adminPages/AddProductForm";

interface DashboardProps {
  userData: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    image?: string;
    is_admin: number; // from profiles.is_admin (was role)
  } | null;
}

const Loading = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-6 w-1/3 bg-black/5" />
    <div className="h-40 bg-black/5" />
  </div>
);

const DashboardContent = dynamic(
  () => import("@/../components/admin/Sidebar/DashboardContent"),
  { ssr: false, loading: () => <Loading /> },
);

const OrdersPage = dynamic(
  () => import("@/../components/admin/Sidebar/OrderPage"),
  { ssr: false, loading: () => <Loading /> },
);

const ProductsPage = dynamic(
  () => import("@/../components/admin/Sidebar/ProductsPage"),
  { ssr: false, loading: () => <Loading /> },
);

const SettingsPage = dynamic(
  () => import("@/../components/admin/Sidebar/Settings"),
  { ssr: false, loading: () => <Loading /> },
);

const CustomersPage = dynamic(
  () => import("@/../components/admin/Sidebar/CustomerPage"),
  { ssr: false, loading: () => <Loading /> },
);

export default function AdminDashboard({ userData }: DashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const { full_name, email, image } = userData;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "orders":
        return <OrdersPage />;
      case "products":
        return <ProductsPage />;
      case "settings":
        return <SettingsPage />;

      case "customers":
        return <CustomersPage />;

      case "add_product":
        return <AddProductForm />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f7f6f4] overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
        full_name={full_name}
        email={email}
        image={image}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onNewProductClick={() => setActivePage("add_product")}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-5 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              <FadeIn key={activePage}>{renderPage()}</FadeIn>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
