import { User } from "lucide-react";
import type { DashboardProduct } from "@/../types/adminTypes";

export default function TopProducts({
  products,
}: {
  products: DashboardProduct[];
}) {
  const max = Math.max(...products.map((p) => p.unitsSold));

  return (
    <div className="bg-white border border-[#e8e4de] rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] tracking-[0.2em] text-[#9e9892] font-medium">
          TOP PRODUCTS
        </p>
        <button className="text-[9px] tracking-[0.15em] text-[#c9a84c] hover:text-[#0a0a0a] transition-colors">
          ALL PRODUCTS
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-12 h-12 flex-shrink-0 bg-[#f7f6f4] border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#c9c5bf]">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#0a0a0a] truncate group-hover:text-[#c9a84c] transition-colors">
                {product.name}
              </p>
              <p className="text-[9px] tracking-[0.15em] text-[#9e9892] mt-0.5">
                {product.category}
              </p>
              <div className="mt-1.5 h-0.5 w-full bg-[#f0ece6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0a0a0a] rounded-full transition-all duration-700"
                  style={{ width: `${(product.unitsSold / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="text-[18px] font-light text-[#0a0a0a] leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.unitsSold}
              </p>
              <p className="text-[8px] tracking-[0.1em] text-[#9e9892] mt-0.5">
                UNITS SOLD
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
