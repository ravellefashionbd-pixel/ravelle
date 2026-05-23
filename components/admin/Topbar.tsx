"use client";

import { Bell,Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  onNewProductClick: () => void;
}

export default function Topbar({ onMenuClick,onNewProductClick }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-[#e8e4de] bg-white sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
           onClick={onMenuClick}
          className="lg:hidden text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="text-[10px] tracking-[0.25em] text-[#9e9892] font-medium">
          DASHBOARD
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-[0.15em] text-[#9e9892] hidden sm:block">
          APR 21, 2026
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#2d7a4f] hidden sm:block" />
        <button className="w-9 h-9 rounded-sm border border-[#e8e4de] flex items-center justify-center text-[#6b6560] hover:bg-[#f7f6f4] transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
        </button>
        <button
         onClick={onNewProductClick}
         className="text-[10px] tracking-[0.25em] border border-[#e8e4de] px-3 py-1.5 text-[#0a0a0a] hover:border-[#0a0a0a] transition">
          NEW PRODUCT
        </button>
      </div>
    </header>
  );
}
