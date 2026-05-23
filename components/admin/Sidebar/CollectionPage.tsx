"use client";

import { ShoppingCart, Plus } from "lucide-react";

const collections = [
  { name: "Summer Soirée 2025", products: 24, status: "PUBLISHED", cover: "bg-amber-100" },
  { name: "Resort Capsule",     products: 12, status: "PUBLISHED", cover: "bg-sky-100" },
  { name: "Evening Edit",       products: 18, status: "DRAFT",     cover: "bg-rose-100" },
  { name: "Coastal Linen",      products: 9,  status: "PUBLISHED", cover: "bg-teal-100" },
  { name: "Archive Pieces",     products: 31, status: "DRAFT",     cover: "bg-stone-100" },
  { name: "Winter Preview",     products: 6,  status: "DRAFT",     cover: "bg-indigo-100" },
];

export default function CollectionsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">CATALOGUE</h2>
          <h1 className="text-2xl font-light tracking-wider text-black">Collections</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] tracking-[0.2em] hover:bg-black/80 transition">
          <Plus size={12} /> NEW COLLECTION
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c.name} className="bg-white border border-black/8 overflow-hidden hover:shadow-md transition cursor-pointer">
            <div className={`h-32 ${c.cover} flex items-center justify-center`}>
              <ShoppingCart size={28} strokeWidth={1} className="text-black/20" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-black font-medium">{c.name}</p>
                  <p className="text-[10px] text-black/40 mt-1">{c.products} products</p>
                </div>
                <span className={`text-[9px] tracking-[0.15em] px-2 py-1 ${
                  c.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/50"
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 py-1.5 border border-black/15 text-[9px] tracking-[0.2em] text-black/60 hover:bg-black/5 transition">EDIT</button>
                <button className="flex-1 py-1.5 border border-black/15 text-[9px] tracking-[0.2em] text-black/60 hover:bg-black/5 transition">VIEW</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
