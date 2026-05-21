"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const COLS = [
  {
    heading: "Shop",
    links: [
      { label: "Fragrances", href: "/category/fragrances" },
      { label: "Jewellery", href: "/category/jewellery" },
      { label: "Watches", href: "/category/watches" },
      { label: "Clothing", href: "/category/clothing" },
      { label: "New In", href: "/new" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Track Order", href: "/track" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-black text-white">
      {/* MAIN */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/ravelle_logo.png"
                alt="Ravelle"
                width={90}
                height={30}
                className="invert"
              />
            </Link>

            <div className="flex gap-4 text-[11px] text-white/50">
              <a href="#">IG</a>
              <a href="#">FB</a>
              <a href="#">YT</a>
            </div>
          </div>

          {/* Links */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
                {col.heading}
              </p>

              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[12px] text-white/60 hover:text-white transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
              Newsletter
            </p>

            <div className="flex border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent outline-none text-[12px] flex-1 placeholder:text-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="text-[11px] tracking-widest text-white/60 hover:text-white transition">
                Join
              </button>
            </div>

            <p className="text-[10px] text-white/30 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-white/40 tracking-widest uppercase">
          <span>© {new Date().getFullYear()} Ravelle</span>

          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>

          <span>Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
