"use client";

import Image from "next/image";
import Link from "next/link";

const BrandStory = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={"/our_history_bg.jpg"}
                alt="Brand Story"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10 text-center md:text-left">
            {/* Small label */}
            <p className="text-[11px] tracking-[0.45em] uppercase text-neutral-400">
              Since 2026
            </p>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] text-black">
              Crafting elegance <br />
              <span>for every moment</span>
            </h2>

            {/* Thin divider */}
            <div className="w-16 h-[1px] bg-black/20"></div>

            {/* Story */}
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md">
              Ravelle is dedicated to refined beauty — where cosmetics and
              jewelry meet timeless craftsmanship for the modern lifestyle.
            </p>

            <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md">
              Every collection is curated with precision, focusing on purity,
              detail, and effortless elegance.
            </p>

            {/* CTA */}
            <Link
              href="/about"
              className="inline-block text-[11px] tracking-[0.4em] uppercase text-black border-b border-black pb-1 hover:opacity-50 transition"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
