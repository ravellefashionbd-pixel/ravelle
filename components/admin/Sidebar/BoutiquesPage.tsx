"use client";

import { Store, MapPin, Plus } from "lucide-react";

const boutiques = [
  { name: "Paris — Le Marais",  address: "12 Rue des Rosiers, 75004",      status: "OPEN",   manager: "Claire Dubois",   revenue: "$28,400" },
  { name: "Lyon — Presqu'île",  address: "45 Rue de la République, 69002", status: "OPEN",   manager: "Antoine Faure",   revenue: "$14,200" },
  { name: "London — Mayfair",   address: "8 Mount Street, W1K 3NF",        status: "CLOSED", manager: "Victoria Hayes",  revenue: "$19,800" },
  { name: "Nice — Promenade",   address: "3 Promenade des Anglais, 06000", status: "OPEN",   manager: "Marc Girard",     revenue: "$9,600" },
];

export default function BoutiquesPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">STORE</h2>
          <h1 className="text-2xl font-light tracking-wider text-black">Boutiques</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] tracking-[0.2em] hover:bg-black/80 transition">
          <Plus size={12} /> ADD BOUTIQUE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boutiques.map((b) => (
          <div key={b.name} className="bg-white border border-black/8 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-black/5 border border-black/10 flex items-center justify-center">
                <Store size={16} strokeWidth={1.5} className="text-black/40" />
              </div>
              <span className={`text-[9px] tracking-[0.2em] px-2 py-1 ${
                b.status === "OPEN" ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/50"
              }`}>
                {b.status}
              </span>
            </div>
            <p className="text-[12px] tracking-[0.15em] text-black font-medium">{b.name}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-black/40">
              <MapPin size={10} /> {b.address}
            </div>
            <div className="mt-4 pt-4 border-t border-black/8 flex gap-6">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-black/30">MANAGER</p>
                <p className="text-[11px] text-black mt-0.5">{b.manager}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] text-black/30">REVENUE</p>
                <p className="text-[11px] text-black mt-0.5">{b.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
