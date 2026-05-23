"use client";
import { useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Users,
  Store,
  BarChart2,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";

const navSections = [
  {
    section: "MAISON",
    items: [
      {
        label: "HOME",
        key: "home",
        icon: <Home size={13} strokeWidth={1.5} />,
      },
      {
        label: "DASHBOARD",
        key: "dashboard",
        icon: <LayoutDashboard size={13} strokeWidth={1.5} />,
      },
      {
        label: "ORDERS",
        key: "orders",
        icon: <ShoppingBag size={13} strokeWidth={1.5} />,
      },
    ],
  },
  {
    section: "CATALOGUE",
    items: [
      {
        label: "COLLECTIONS",
        key: "collections",
        icon: <ShoppingCart size={13} strokeWidth={1.5} />,
      },
      {
        label: "PRODUCTS",
        key: "products",
        icon: <Heart size={13} strokeWidth={1.5} />,
      },
      {
        label: "CUSTOMERS",
        key: "customers",
        icon: <Users size={13} strokeWidth={1.5} />,
      },
    ],
  },
  {
    section: "STORE",
    items: [
      {
        label: "BOUTIQUES",
        key: "boutiques",
        icon: <Store size={13} strokeWidth={1.5} />,
      },
      {
        label: "ANALYTICS",
        key: "analytics",
        icon: <BarChart2 size={13} strokeWidth={1.5} />,
      },
      {
        label: "SETTINGS",
        key: "settings",
        icon: <Settings size={13} strokeWidth={1.5} />,
      },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  full_name: string;
  email: string;
  image?: string;
}

export default function Sidebar({
  mobileOpen,
  onClose,
  activePage,
  setActivePage,
  full_name,
  email,
  image,
}: SidebarProps) {
  const router = useRouter();
  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] z-40 flex flex-col
          bg-white border-r border-black/10
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Header */}
        <div className="px-6 py-7 border-b border-black/10 flex items-center justify-between">
          <div>
            <h1 className="text-sm tracking-[0.3em] font-medium text-black">
              LIFECORNER
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-black/50 italic mt-1">
              Curated for life
            </p>
          </div>

          <button onClick={onClose} className="lg:hidden text-black/60">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section, si) => (
            <div key={section.section}>
              {si > 0 && (
                <div className="text-center text-[10px] text-black/30 tracking-[0.3em] py-2">
                  — ✦ —
                </div>
              )}

              <p className="text-[9px] tracking-[0.3em] text-black/40 mb-2 px-2">
                {section.section}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activePage === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key === "home") {
                          router.push("/");
                        } else {
                          setActivePage(item.key);
                        }
                        onClose();
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-left
                        text-[10px] tracking-[0.2em] transition
                        border border-transparent
                        ${
                          isActive
                            ? "bg-black text-white"
                            : "text-black/60 hover:text-black hover:bg-black/5"
                        }
                      `}
                    >
                      <span className="flex items-center opacity-80">
                        {item.icon}
                      </span>

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Admin */}
        <div className="border-t border-black/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 bg-black/5">
              <Image
                src={image || "/default-avatar.png"}
                alt="profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-[10px] tracking-[0.2em] text-black">
                {full_name}
              </p>
              <p className="text-xs italic text-black/50">{email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
