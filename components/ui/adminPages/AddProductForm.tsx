"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/../lib/supabase/supabaseClient";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = "draft" | "active" | "archived";
type GenderTarget = "men" | "women" | "unisex" | "kids";
type SizeLabel =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL"
  | "FREE SIZE"
  | "";
type CategoryType = "perfume" | "clothing" | "cosmetics" | "watches";

interface Variant {
  id: string;
  sku: string;
  price: string;
  stock_qty: string;
  size: SizeLabel;
  color_name: string;
  color_hex: string;
  compare_price: string;
  weight_gm: string;
  volume_ml: string;
  bottle_type: string;
  is_decant: boolean;
  chest_cm: string;
  waist_cm: string;
  length_cm: string;
  shoulder_cm: string;
}

interface PerfumeDetails {
  brand_name: string;
  country_origin: string;
  scent_family: string;
  concentration: string;
  top_notes: string;
  middle_notes: string;
  base_notes: string;
  longevity_hrs: string;
  sillage: string;
  gender_target: GenderTarget;
  season: string[];
}

interface ClothingDetails {
  clothing_type: string;
  fabric_material: string;
  gender_target: GenderTarget;
  care_instr: string;
  country_origin: string;
}

// Renamed from FormData → ProductFormData to avoid conflict with browser's FormData API
interface ProductFormData {
  name: string;
  slug: string;
  category_type: CategoryType | "";
  description: string;
  base_price: string;
  status: ProductStatus;
  meta_title: string;
  meta_desc: string;
  perfume: PerfumeDetails;
  clothing: ClothingDetails;
  variants: Variant[];
  images: File[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const uid = () => Math.random().toString(36).slice(2, 8);

const emptyVariant = (): Variant => ({
  id: uid(),
  sku: "",
  price: "",
  stock_qty: "",
  size: "",
  color_name: "",
  color_hex: "#000000",
  compare_price: "",
  weight_gm: "",
  volume_ml: "",
  bottle_type: "original",
  is_decant: false,
  chest_cm: "",
  waist_cm: "",
  length_cm: "",
  shoulder_cm: "",
});

const INITIAL: ProductFormData = {
  name: "",
  slug: "",
  category_type: "",
  description: "",
  base_price: "",
  status: "draft",
  meta_title: "",
  meta_desc: "",
  perfume: {
    brand_name: "",
    country_origin: "",
    scent_family: "",
    concentration: "",
    top_notes: "",
    middle_notes: "",
    base_notes: "",
    longevity_hrs: "",
    sillage: "",
    gender_target: "unisex",
    season: [],
  },
  clothing: {
    clothing_type: "",
    fabric_material: "",
    gender_target: "men",
    care_instr: "",
    country_origin: "Bangladesh",
  },
  variants: [emptyVariant()],
  images: [],
};

const SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const SIZES: SizeLabel[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "FREE SIZE",
];
const CONCENTRATIONS = ["EDT", "EDP", "Parfum", "EDC", "Attar", "Body Mist"];
const SILLAGE_OPTIONS = ["Intimate", "Moderate", "Strong", "Enormous"];
const SCENT_FAMILIES = [
  "Floral",
  "Woody",
  "Fresh",
  "Oud",
  "Citrus",
  "Oriental",
  "Aquatic",
  "Gourmand",
  "Chypre",
  "Fougère",
];
const CLOTHING_TYPES = [
  "Jersey",
  "T-shirt",
  "Panjabi",
  "Shirt",
  "Pant",
  "Suits",
  "Hoodie",
  "Jacket",
];
const BOTTLE_TYPES = ["Original", "Tester", "Travel Size", "Refill"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-2 font-medium">
      {children}
      {required && <span className="text-zinc-900 ml-1">*</span>}
    </label>
  );
}

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error && (
        <p className="mt-1.5 text-[10px] tracking-wide text-red-500">{error}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors duration-150";

const selectCls =
  "w-full bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors duration-150 appearance-none cursor-pointer";

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-5 pb-6 border-b border-zinc-100 mb-8">
      <span
        className="text-[42px] leading-none font-light text-zinc-100 select-none"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {number}
      </span>
      <div>
        <h2
          className="text-lg font-light text-zinc-900 tracking-wide"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-zinc-400 mt-0.5 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddProductForm({
  onSuccess,
  onDiscard,
}: {
  onSuccess?: (productId: string) => void;
  onDiscard?: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>(INITIAL);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<
    "identity" | "details" | "variants" | "seo"
  >("identity");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Setters ──────────────────────────────────────────────────────────────

  const set = (patch: Partial<ProductFormData>) =>
    setForm((p) => {
      const n = { ...p, ...patch };
      if ("name" in patch) n.slug = slugify(patch.name ?? "");
      return n;
    });

  const setPerfume = (patch: Partial<PerfumeDetails>) =>
    setForm((p) => ({ ...p, perfume: { ...p.perfume, ...patch } }));

  const setClothing = (patch: Partial<ClothingDetails>) =>
    setForm((p) => ({ ...p, clothing: { ...p.clothing, ...patch } }));

  const clearErr = (k: string) =>
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });

  // ── Variants ─────────────────────────────────────────────────────────────

  const addVariant = () =>
    setForm((p) => ({ ...p, variants: [...p.variants, emptyVariant()] }));

  const removeVariant = (id: string) =>
    setForm((p) => ({ ...p, variants: p.variants.filter((v) => v.id !== id) }));

  const updateVariant = (id: string, patch: Partial<Variant>) =>
    setForm((p) => ({
      ...p,
      variants: p.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));

  // ── Images ───────────────────────────────────────────────────────────────

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const toAdd = arr.slice(0, 8 - form.images.length);
      if (!toAdd.length) return;
      toAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setPreviews((p) => [...p, ev.target?.result as string]);
        reader.readAsDataURL(file);
      });
      setForm((p) => ({ ...p, images: [...p.images, ...toAdd] }));
    },
    [form.images],
  );

  const removeImage = (i: number) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }));
    setPreviews((p) => p.filter((_, j) => j !== i));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.category_type) e.category_type = "Category type is required";
    if (!form.base_price || isNaN(Number(form.base_price)))
      e.base_price = "Valid base price is required";
    form.variants.forEach((v, i) => {
      if (!v.sku.trim()) e[`variant_${i}_sku`] = "SKU is required";
      if (!v.price || isNaN(Number(v.price)))
        e[`variant_${i}_price`] = "Valid price is required";
      if (!v.stock_qty || isNaN(Number(v.stock_qty)))
        e[`variant_${i}_stock`] = "Stock qty is required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit → Supabase ─────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const isPerfume = form.category_type === "perfume";
      const isClothing = form.category_type === "clothing";

      type DescriptionMeta =
        | { type: "perfume"; details: PerfumeDetails; body: string }
        | { type: "clothing"; details: ClothingDetails; body: string }
        | { type: string; body: string };

      const descriptionMeta: DescriptionMeta = isPerfume
        ? { type: "perfume", details: form.perfume, body: form.description }
        : isClothing
          ? { type: "clothing", details: form.clothing, body: form.description }
          : { type: form.category_type, body: form.description };

      const descriptionJson = JSON.stringify(descriptionMeta);

      // 1. Insert product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name: form.name.trim(),
          slug: form.slug || slugify(form.name),
          category_slug: form.category_type as string,
          description: descriptionJson,
          base_price: Number(form.base_price),
          is_active: form.status === "active" ? 1 : 0,
          meta_title: form.meta_title.trim() || null,
          meta_description: form.meta_desc.trim() || null,
        })
        .select("id")
        .single();

      if (productError || !product) {
        throw new Error(productError?.message ?? "Failed to insert product");
      }

      const productId = product.id;

      // 2. Insert variants
      const variantRows = form.variants.map((v) => ({
        product_id: productId,
        size: v.size || "ONE SIZE",
        color: v.color_name.trim() || null,
        color_hex: v.color_hex || null,
        stock_qty: Number(v.stock_qty) || 0,
        price: Number(v.price),
        sku: v.sku.trim(),
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantRows);

      if (variantsError) throw new Error(variantsError.message);

      // 3. Upload images
      if (form.images.length > 0) {
        const imageInserts: {
          product_id: string;
          url: string;
          is_primary: number;
          sort_order: number;
          alt_text: string | null;
        }[] = [];

        for (let i = 0; i < form.images.length; i++) {
          const file = form.images[i];
          const ext = file.name.split(".").pop();
          const path = `products/${productId}/${uid()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(path, file, { upsert: false });

          if (uploadError) {
            console.error("Image upload failed:", uploadError.message);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(path);

          imageInserts.push({
            product_id: productId,
            url: urlData.publicUrl,
            is_primary: i === 0 ? 1 : 0,
            sort_order: i,
            alt_text: form.name || null,
          });
        }

        if (imageInserts.length > 0) {
          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageInserts);

          if (imagesError)
            console.error("Image record insert failed:", imagesError.message);
        }
      }

      toast.success(`"${form.name}" published successfully!`);
      setForm(INITIAL);
      setPreviews([]);
      setErrors({});
      setActiveTab("identity");
      onSuccess?.(productId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setForm(INITIAL);
    setPreviews([]);
    setErrors({});
    setActiveTab("identity");
    onDiscard?.();
  };

  const isPerfume = form.category_type === "perfume";
  const isClothing = form.category_type === "clothing";

  const tabs = [
    { key: "identity", label: "Identity" },
    {
      key: "details",
      label: isPerfume ? "Perfume" : isClothing ? "Clothing" : "Details",
    },
    { key: "variants", label: `Variants (${form.variants.length})` },
    { key: "seo", label: "SEO & Meta" },
  ] as const;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[9px] tracking-[0.5em] uppercase text-zinc-300">
              Product Studio
            </span>
            <span className="w-px h-4 bg-zinc-200" />
            <span
              className="text-base font-light text-zinc-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              New Listing
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-[9px] tracking-[0.35em] uppercase px-3 py-1 border ${
                form.status === "active"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-zinc-200 text-zinc-400"
              }`}
            >
              {form.status}
            </span>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value as ProductStatus })}
              className="text-[9px] tracking-[0.2em] uppercase bg-transparent border border-zinc-200 px-3 py-1.5 text-zinc-600 focus:outline-none focus:border-zinc-900 cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex gap-0 border-t border-zinc-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`text-[10px] tracking-[0.25em] uppercase px-5 py-3.5 transition-all duration-150 border-b-2 ${
                activeTab === tab.key
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Form Body ── */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
          {/* ══ IDENTITY TAB ══ */}
          {activeTab === "identity" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left col */}
              <div className="lg:col-span-3 space-y-8">
                <SectionHeader
                  number="01"
                  title="Product Identity"
                  subtitle="Core listing information"
                />

                <Field error={errors.name}>
                  <Label required>Product Name</Label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Bvlgari Man Black Orient EDP"
                    value={form.name}
                    onChange={(e) => {
                      set({ name: e.target.value });
                      clearErr("name");
                    }}
                  />
                </Field>

                <Field>
                  <Label>Slug</Label>
                  <div className="flex items-center border border-zinc-200 focus-within:border-zinc-900 transition-colors">
                    <span className="px-3 py-3 text-xs text-zinc-300 border-r border-zinc-200 bg-zinc-50 select-none">
                      /products/
                    </span>
                    <input
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-900 focus:outline-none"
                      value={form.slug}
                      onChange={(e) => set({ slug: e.target.value })}
                    />
                  </div>
                </Field>

                <Field error={errors.category_type}>
                  <Label required>Category Type</Label>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={form.category_type}
                      onChange={(e) => {
                        set({ category_type: e.target.value as CategoryType });
                        clearErr("category_type");
                      }}
                    >
                      <option value="">Select category type</option>
                      <option value="perfume">Perfume</option>
                      <option value="clothing">Clothing</option>
                      <option value="cosmetics">Cosmetics</option>
                      <option value="watches">Watches</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                      ▾
                    </span>
                  </div>
                </Field>

                <Field>
                  <Label>Description</Label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={5}
                    placeholder="Describe the product — scent profile, materials, story…"
                    value={form.description}
                    onChange={(e) => set({ description: e.target.value })}
                  />
                </Field>

                <Field error={errors.base_price}>
                  <Label required>Base Price (BDT)</Label>
                  <div className="flex items-center border border-zinc-200 focus-within:border-zinc-900 transition-colors">
                    <span className="px-4 py-3 text-xs text-zinc-400 border-r border-zinc-200 bg-zinc-50">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-900 focus:outline-none"
                      placeholder="0.00"
                      value={form.base_price}
                      onChange={(e) => {
                        set({ base_price: e.target.value });
                        clearErr("base_price");
                      }}
                    />
                  </div>
                </Field>
              </div>

              {/* Right col — Image Gallery */}
              <div className="lg:col-span-2">
                <SectionHeader
                  number="02"
                  title="Image Gallery"
                  subtitle={`${form.images.length}/8 images`}
                />

                <div
                  className="border-2 border-dashed border-zinc-200 p-8 text-center hover:border-zinc-400 transition-colors cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addImages(e.dataTransfer.files);
                  }}
                >
                  <div className="text-2xl mb-3 text-zinc-200">⊕</div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">
                    Drop images here
                  </p>
                  <p className="text-[10px] text-zinc-300 mt-1">
                    or click to browse
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && addImages(e.target.files)
                    }
                  />
                </div>

                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {previews.map((src, i) => (
                      <div
                        key={i}
                        className="relative group aspect-square overflow-hidden bg-zinc-50"
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-[8px] tracking-widest uppercase bg-zinc-900 text-white px-1.5 py-0.5">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-white text-zinc-900 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ DETAILS TAB ══ */}
          {activeTab === "details" && (
            <div>
              {!form.category_type && (
                <div className="text-center py-20">
                  <p className="text-zinc-300 text-[11px] tracking-[0.4em] uppercase">
                    Select a category type first
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("identity")}
                    className="mt-4 text-[10px] tracking-widest uppercase text-zinc-900 border border-zinc-900 px-5 py-2 hover:bg-zinc-900 hover:text-white transition-all"
                  >
                    Go to Identity →
                  </button>
                </div>
              )}

              {isPerfume && (
                <div>
                  <SectionHeader
                    number="03"
                    title="Perfume Details"
                    subtitle="Scent profile & brand information"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Field>
                      <Label>Brand Name</Label>
                      <input
                        className={inputCls}
                        placeholder="e.g. Bvlgari"
                        value={form.perfume.brand_name}
                        onChange={(e) =>
                          setPerfume({ brand_name: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Country of Origin</Label>
                      <input
                        className={inputCls}
                        placeholder="e.g. Italy"
                        value={form.perfume.country_origin}
                        onChange={(e) =>
                          setPerfume({ country_origin: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Concentration</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.perfume.concentration}
                          onChange={(e) =>
                            setPerfume({ concentration: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          {CONCENTRATIONS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Scent Family</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.perfume.scent_family}
                          onChange={(e) =>
                            setPerfume({ scent_family: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          {SCENT_FAMILIES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Gender Target</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.perfume.gender_target}
                          onChange={(e) =>
                            setPerfume({
                              gender_target: e.target.value as GenderTarget,
                            })
                          }
                        >
                          <option value="unisex">Unisex</option>
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="kids">Kids</option>
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Sillage</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.perfume.sillage}
                          onChange={(e) =>
                            setPerfume({ sillage: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          {SILLAGE_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Top Notes</Label>
                      <input
                        className={inputCls}
                        placeholder="Bergamot, Lemon, Grapefruit"
                        value={form.perfume.top_notes}
                        onChange={(e) =>
                          setPerfume({ top_notes: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Middle Notes</Label>
                      <input
                        className={inputCls}
                        placeholder="Rose, Jasmine, Iris"
                        value={form.perfume.middle_notes}
                        onChange={(e) =>
                          setPerfume({ middle_notes: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Base Notes</Label>
                      <input
                        className={inputCls}
                        placeholder="Musk, Sandalwood, Amber"
                        value={form.perfume.base_notes}
                        onChange={(e) =>
                          setPerfume({ base_notes: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Longevity (hours)</Label>
                      <input
                        type="number"
                        min="1"
                        max="48"
                        className={inputCls}
                        placeholder="8"
                        value={form.perfume.longevity_hrs}
                        onChange={(e) =>
                          setPerfume({ longevity_hrs: e.target.value })
                        }
                      />
                    </Field>
                    <div className="md:col-span-2">
                      <Label>Season</Label>
                      <div className="flex gap-3 flex-wrap mt-1">
                        {SEASONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              setPerfume({
                                season: form.perfume.season.includes(s)
                                  ? form.perfume.season.filter((x) => x !== s)
                                  : [...form.perfume.season, s],
                              })
                            }
                            className={`text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-150 ${
                              form.perfume.season.includes(s)
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-zinc-200 text-zinc-500 hover:border-zinc-500"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isClothing && (
                <div>
                  <SectionHeader
                    number="03"
                    title="Clothing Details"
                    subtitle="Garment specifications"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Field>
                      <Label>Clothing Type</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.clothing.clothing_type}
                          onChange={(e) =>
                            setClothing({ clothing_type: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          {CLOTHING_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Fabric / Material</Label>
                      <input
                        className={inputCls}
                        placeholder="100% Cotton"
                        value={form.clothing.fabric_material}
                        onChange={(e) =>
                          setClothing({ fabric_material: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <Label>Gender Target</Label>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={form.clothing.gender_target}
                          onChange={(e) =>
                            setClothing({
                              gender_target: e.target.value as GenderTarget,
                            })
                          }
                        >
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="unisex">Unisex</option>
                          <option value="kids">Kids</option>
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <Label>Country of Origin</Label>
                      <input
                        className={inputCls}
                        placeholder="Bangladesh"
                        value={form.clothing.country_origin}
                        onChange={(e) =>
                          setClothing({ country_origin: e.target.value })
                        }
                      />
                    </Field>
                    <div className="md:col-span-2">
                      <Label>Care Instructions</Label>
                      <input
                        className={inputCls}
                        placeholder="Machine wash cold, do not bleach, hang dry"
                        value={form.clothing.care_instr}
                        onChange={(e) =>
                          setClothing({ care_instr: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {(form.category_type === "cosmetics" ||
                form.category_type === "watches") && (
                <div className="text-center py-12 border border-dashed border-zinc-200">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-300">
                    Additional details for {form.category_type} — configure in
                    variants
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ══ VARIANTS TAB ══ */}
          {activeTab === "variants" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <SectionHeader
                  number="04"
                  title="Product Variants"
                  subtitle="SKU, pricing, stock & sizing — maps to product_variants table"
                />
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-[10px] tracking-[0.25em] uppercase border border-zinc-900 px-5 py-2.5 hover:bg-zinc-900 hover:text-white transition-all duration-150 flex-shrink-0 -mt-8"
                >
                  + Add Variant
                </button>
              </div>

              <div className="space-y-6">
                {form.variants.map((v, i) => (
                  <div
                    key={v.id}
                    className="border border-zinc-100 p-6 relative"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">
                        Variant {String(i + 1).padStart(2, "0")}
                      </span>
                      {form.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(v.id)}
                          className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <Field error={errors[`variant_${i}_sku`]}>
                        <Label required>SKU</Label>
                        <input
                          className={inputCls}
                          placeholder="PERF-001-100ML"
                          value={v.sku}
                          onChange={(e) => {
                            updateVariant(v.id, { sku: e.target.value });
                            clearErr(`variant_${i}_sku`);
                          }}
                        />
                      </Field>
                      <Field error={errors[`variant_${i}_price`]}>
                        <Label required>Price (৳)</Label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          placeholder="0.00"
                          value={v.price}
                          onChange={(e) => {
                            updateVariant(v.id, { price: e.target.value });
                            clearErr(`variant_${i}_price`);
                          }}
                        />
                      </Field>
                      <Field error={errors[`variant_${i}_stock`]}>
                        <Label required>Stock Qty</Label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          placeholder="0"
                          value={v.stock_qty}
                          onChange={(e) => {
                            updateVariant(v.id, { stock_qty: e.target.value });
                            clearErr(`variant_${i}_stock`);
                          }}
                        />
                      </Field>
                      <Field>
                        <Label>Compare Price (৳)</Label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          placeholder="0.00"
                          value={v.compare_price}
                          onChange={(e) =>
                            updateVariant(v.id, {
                              compare_price: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <Field>
                        <Label>Color Name</Label>
                        <input
                          className={inputCls}
                          placeholder="Midnight Black"
                          value={v.color_name}
                          onChange={(e) =>
                            updateVariant(v.id, { color_name: e.target.value })
                          }
                        />
                      </Field>
                      <Field>
                        <Label>Color Hex</Label>
                        <div className="flex items-center border border-zinc-200 focus-within:border-zinc-900 transition-colors">
                          <input
                            type="color"
                            className="h-full w-10 border-0 cursor-pointer p-1 bg-transparent"
                            value={v.color_hex}
                            onChange={(e) =>
                              updateVariant(v.id, { color_hex: e.target.value })
                            }
                          />
                          <span className="px-3 text-xs text-zinc-500 font-mono">
                            {v.color_hex}
                          </span>
                        </div>
                      </Field>
                      <Field>
                        <Label>Weight (grams)</Label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          placeholder="150"
                          value={v.weight_gm}
                          onChange={(e) =>
                            updateVariant(v.id, { weight_gm: e.target.value })
                          }
                        />
                      </Field>
                    </div>

                    {isPerfume && (
                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-300 mb-4">
                          Bottle Details
                          <span className="ml-2 text-zinc-200 normal-case tracking-normal">
                            (size = volume e.g. 100ml)
                          </span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Field>
                            <Label>Volume (ml) → Size</Label>
                            <input
                              type="number"
                              min="0"
                              className={inputCls}
                              placeholder="100"
                              value={v.volume_ml}
                              onChange={(e) =>
                                updateVariant(v.id, {
                                  volume_ml: e.target.value,
                                  size: `${e.target.value}ml` as SizeLabel,
                                })
                              }
                            />
                          </Field>
                          <Field>
                            <Label>Bottle Type</Label>
                            <div className="relative">
                              <select
                                className={selectCls}
                                value={v.bottle_type}
                                onChange={(e) =>
                                  updateVariant(v.id, {
                                    bottle_type: e.target.value,
                                  })
                                }
                              >
                                {BOTTLE_TYPES.map((b) => (
                                  <option key={b} value={b.toLowerCase()}>
                                    {b}
                                  </option>
                                ))}
                              </select>
                              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                                ▾
                              </span>
                            </div>
                          </Field>
                          <Field>
                            <Label>Is Decant?</Label>
                            <button
                              type="button"
                              onClick={() =>
                                updateVariant(v.id, { is_decant: !v.is_decant })
                              }
                              className={`w-full py-3 px-4 text-[10px] tracking-[0.25em] uppercase border transition-all ${
                                v.is_decant
                                  ? "bg-zinc-900 text-white border-zinc-900"
                                  : "border-zinc-200 text-zinc-500"
                              }`}
                            >
                              {v.is_decant ? "Yes — Decant" : "No — Original"}
                            </button>
                          </Field>
                        </div>
                      </div>
                    )}

                    {isClothing && (
                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-300 mb-4">
                          Size & Measurements
                          <span className="ml-2 text-zinc-200 normal-case tracking-normal">
                            (size label maps to product_variants.size)
                          </span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <Label>Size Label → Size</Label>
                            <div className="flex flex-wrap gap-1">
                              {SIZES.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() =>
                                    updateVariant(v.id, { size: s })
                                  }
                                  className={`text-[9px] px-2.5 py-1.5 border transition-all ${
                                    v.size === s
                                      ? "bg-zinc-900 text-white border-zinc-900"
                                      : "border-zinc-200 text-zinc-500 hover:border-zinc-500"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Field>
                            <Label>Chest (cm)</Label>
                            <input
                              type="number"
                              className={inputCls}
                              placeholder="96.5"
                              value={v.chest_cm}
                              onChange={(e) =>
                                updateVariant(v.id, {
                                  chest_cm: e.target.value,
                                })
                              }
                            />
                          </Field>
                          <Field>
                            <Label>Waist (cm)</Label>
                            <input
                              type="number"
                              className={inputCls}
                              placeholder="80"
                              value={v.waist_cm}
                              onChange={(e) =>
                                updateVariant(v.id, {
                                  waist_cm: e.target.value,
                                })
                              }
                            />
                          </Field>
                          <Field>
                            <Label>Length (cm)</Label>
                            <input
                              type="number"
                              className={inputCls}
                              placeholder="70"
                              value={v.length_cm}
                              onChange={(e) =>
                                updateVariant(v.id, {
                                  length_cm: e.target.value,
                                })
                              }
                            />
                          </Field>
                          <Field>
                            <Label>Shoulder (cm)</Label>
                            <input
                              type="number"
                              className={inputCls}
                              placeholder="44"
                              value={v.shoulder_cm}
                              onChange={(e) =>
                                updateVariant(v.id, {
                                  shoulder_cm: e.target.value,
                                })
                              }
                            />
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SEO TAB ══ */}
          {activeTab === "seo" && (
            <div className="max-w-2xl">
              <SectionHeader
                number="05"
                title="SEO & Meta"
                subtitle="Search engine optimisation — maps to meta_title, meta_description"
              />
              <div className="space-y-6">
                <Field>
                  <Label>Meta Title</Label>
                  <input
                    className={inputCls}
                    placeholder="Buy Bvlgari Man Black Orient EDP in Bangladesh"
                    value={form.meta_title}
                    onChange={(e) => set({ meta_title: e.target.value })}
                  />
                  <p className="text-[10px] text-zinc-300 mt-1.5">
                    {form.meta_title.length}/60 characters
                  </p>
                </Field>
                <Field>
                  <Label>Meta Description</Label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={4}
                    placeholder="Shop authentic Bvlgari Man Black Orient EDP at the best price in Bangladesh. Free delivery…"
                    value={form.meta_desc}
                    onChange={(e) => set({ meta_desc: e.target.value })}
                  />
                  <p className="text-[10px] text-zinc-300 mt-1.5">
                    {form.meta_desc.length}/160 characters
                  </p>
                </Field>

                <div className="border border-zinc-100 p-5">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-300 mb-4">
                    Search Preview
                  </p>
                  <p className="text-blue-600 text-base hover:underline cursor-pointer truncate">
                    {form.meta_title || form.name || "Product Title"}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5">
                    yourstore.com/products/{form.slug || "product-slug"}
                  </p>
                  <p className="text-zinc-600 text-sm mt-1 line-clamp-2">
                    {form.meta_desc ||
                      form.description ||
                      "Meta description will appear here…"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="sticky bottom-0 bg-white border-t border-zinc-100 z-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSubmitting}
              className="text-[10px] tracking-[0.25em] uppercase border border-zinc-200 px-6 py-3 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all duration-150 disabled:opacity-40"
            >
              Discard
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => set({ status: "draft" })}
                className="text-[10px] tracking-[0.25em] uppercase border border-zinc-200 px-6 py-3 text-zinc-600 hover:border-zinc-900 transition-all duration-150 disabled:opacity-40"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-[10px] tracking-[0.3em] uppercase bg-zinc-900 text-white px-8 py-3 hover:bg-black active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]"
              >
                {isSubmitting ? "Publishing…" : "Publish Listing →"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
