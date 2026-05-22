"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("@/../components/user-dashboard/Profile"));
const Orders = dynamic(() => import("@/../components/user-dashboard/Orders"));
const Wishlist = dynamic(
  () => import("@/../components/user-dashboard/Wishlist"),
);
const Settings = dynamic(
  () => import("@/../components/user-dashboard/Settings"),
);

import Sidebar from "@/../components/user-dashboard/Sidebar";
import MobileNav from "@/../components/user-dashboard/MobileNav";
import Navbar from "../layout/HomePage/navbar/Navbar";
import Footer from "../layout/HomePage/Footer";

interface DashboardProps {
  userData: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    avatar_url?: string; // ← image → avatar_url
    is_admin: number; // ← role → is_admin
  } | null;
}

export default function DashboardClient({ userData }: DashboardProps) {
  const [active, setActive] = useState("profile");

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const { full_name, email, phone, avatar_url } = userData;

  const renderContent = () => {
    switch (active) {
      case "profile":
        return (
          <Profile
            full_name={full_name}
            email={email}
            phone={phone}
            image={avatar_url} // ← avatar_url পাঠাচ্ছি image prop এ
          />
        );
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Profile
            full_name={full_name}
            email={email}
            phone={phone}
            image={avatar_url}
          />
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f7f6] flex">
        <Sidebar active={active} setActive={setActive} />
        <main className="flex-1 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 pb-20">
            {renderContent()}
          </div>
        </main>
        <MobileNav active={active} setActive={setActive} />
      </div>
      <Footer />
    </>
  );
}
