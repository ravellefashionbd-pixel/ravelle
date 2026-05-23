"use client";

import { useEffect, useState } from "react";
import { Heart, Plus, Star, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/../lib/supabase/supabaseClient";
import type { Product, ProductImage } from "@/../types/database.types";

// Supabase returns a joined shape — define it explicitly to avoid `any`
type ProductImagePartial = Pick<ProductImage, "url" | "is_primary">;

type ProductRow = Product & {
  product_images: ProductImagePartial[];
};

type ProductWithImage = Product & {
  primaryImage: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProducts() {
      // Fetch active products with their primary image
      const { data: productsData } = await supabase
        .from("products")
        .select(
          `
          *,
          product_images (url, is_primary)
        `,
        )
        .eq("is_active", 1)
        .order("created_at", { ascending: false })
        .limit(12);

      if (!productsData) {
        setLoading(false);
        return;
      }

      const mapped: ProductWithImage[] = (productsData as ProductRow[]).map(
        (p) => {
          const primary = p.product_images?.find((img) => img.is_primary === 1);
          return {
            ...p,
            primaryImage: primary?.url ?? null,
          };
        },
      );

      setProducts(mapped);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">
            CATALOGUE
          </h2>
          <h1 className="text-2xl font-light tracking-wider text-black">
            Products
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] tracking-[0.2em] hover:bg-black/80 transition">
          <Plus size={12} /> ADD PRODUCT
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-black/8 p-5 animate-pulse"
            >
              <div className="h-28 bg-black/5 mb-4" />
              <div className="h-3 bg-black/5 w-3/4 mb-2" />
              <div className="h-2 bg-black/5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-black/8 p-5 hover:shadow-md transition group"
            >
              <div className="h-28 bg-black/4 mb-4 flex items-center justify-center overflow-hidden">
                {p.primaryImage ? (
                  <img
                    src={p.primaryImage}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart size={24} strokeWidth={1} className="text-black/15" />
                )}
              </div>

              <p className="text-[11px] tracking-[0.15em] text-black font-medium">
                {p.name}
              </p>
              <p className="text-[9px] tracking-[0.2em] text-black/40 mt-0.5">
                {p.category_slug.toUpperCase()}
              </p>

              <div className="flex items-center justify-between mt-3">
                <p className="text-sm font-medium text-black">
                  ৳ {p.base_price.toLocaleString()}
                </p>
                {/* Rating placeholder — no rating column in schema */}
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <p className="text-[10px] text-black/50">—</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-[9px] tracking-wider text-black/40">
                  {p.slug}
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button className="text-black/40 hover:text-black">
                    <Edit size={12} />
                  </button>
                  <button className="text-black/40 hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
