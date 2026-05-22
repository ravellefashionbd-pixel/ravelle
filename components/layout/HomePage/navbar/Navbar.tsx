"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Heart, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { slugify } from "@/../constants/slugify";
import { CategoryNode } from "../../../../constants/categories";

// ─── Types ─────────────────────────────────────────────
type NavColumn = {
  title?: string;
  links: { label: string; href: string }[];
};
type NavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  columns: NavColumn[];
};

// ─── Dynamic builder ────────────────────────────────────
function buildNavItems(categories: CategoryNode[]): NavItem[] {
  const dynamic: NavItem[] = categories.map((cat) => {
    const columns: NavColumn[] = [];

    if (cat.children.length === 0) {
      columns.push({ links: [] });
    } else {
      const firstChild = cat.children[0];
      const hasGrandchildren = firstChild?.children.length > 0;

      if (hasGrandchildren) {
        cat.children.forEach((sub) => {
          columns.push({
            title: sub.name,
            links: sub.children.map((item) => ({
              label: item.name,
              href: `/category/${cat.slug}/${sub.slug}/${item.slug}`,
            })),
          });
        });
      } else {
        const grouped: NavColumn = { links: [] };
        cat.children.forEach((sub) => {
          if (sub.children.length > 0) {
            columns.push({
              title: sub.name,
              links: sub.children.map((item) => ({
                label: item.name,
                href: `/category/${cat.slug}/${item.slug}`,
              })),
            });
          } else {
            grouped.links.push({
              label: sub.name,
              href: `/category/${cat.slug}/${sub.slug}`,
            });
          }
        });
        if (grouped.links.length > 0) columns.push(grouped);
      }
    }

    return {
      label: cat.name,
      href: `/category/${cat.slug}`,
      columns,
    };
  });

  return [
    ...dynamic,
    {
      label: "New In",
      href: "/new",
      columns: [
        {
          links: [{ label: "New Arrivals", href: "/new" }],
        },
      ],
    },
    {
      label: "Sale",
      href: "/sale",
      highlight: true,
      columns: [
        {
          links: [
            { label: "Up to 30% Off", href: "/sale/30" },
            { label: "Clearance", href: "/sale/clearance" },
            { label: "Last Pieces", href: "/sale/last" },
          ],
        },
      ],
    },
  ];
}

// ─── Component ──────────────────────────────────────────
export default function Navbar({
  categories = [], // ← fix: undefined হলে empty array
}: {
  categories?: CategoryNode[];
}) {
  const NAV_ITEMS = buildNavItems(categories);

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const cartCount = 2;
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const openMenu = useCallback((label: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setSearchOpen(false);
    setActiveMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setSearchOpen(false);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  return (
    <>
      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-[90] bg-white
          transition-shadow duration-300
          ${
            scrolled
              ? "shadow-[0_1px_12px_rgba(0,0,0,0.07)]"
              : "border-b border-black/[0.06]"
          }
        `}
      >
        {/* ROW */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[60px] sm:h-[64px] flex items-center">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden flex-shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="flex flex-col gap-[5px] group p-2"
            >
              <span className="block w-[20px] h-[1.5px] bg-black rounded-full" />
              <span className="block w-[13px] h-[1.5px] bg-black rounded-full group-hover:w-[20px] transition-all duration-300" />
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mr-10 flex-shrink-0">
            <Link href="/" onClick={closeAll} aria-label="Ravelle">
              <Image
                src="/ravelle_logo.png"
                alt="Ravelle"
                width={80}
                height={28}
                priority
                className="object-contain select-none w-[72px] sm:w-[80px]"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center flex-1 min-w-0"
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onMouseEnter={() => openMenu(item.label)}
                className={`
                  relative h-[64px] px-3 xl:px-4 flex items-center gap-1
                  text-[13px] font-medium tracking-[0.06em] uppercase
                  whitespace-nowrap transition-colors duration-150
                  ${
                    item.highlight
                      ? activeMenu === item.label
                        ? "text-red-600"
                        : "text-red-500 hover:text-red-600"
                      : activeMenu === item.label
                        ? "text-black"
                        : "text-black/50 hover:text-black"
                  }
                `}
              >
                {item.label}
                {item.label === "New In" && (
                  <span className="ml-0.5 text-[7px] tracking-[0.08em] font-semibold bg-black text-white px-[5px] py-[2px] leading-none">
                    NEW
                  </span>
                )}
                <span
                  className={`
                    absolute bottom-0 left-3 xl:left-4 right-3 xl:right-4 h-[2px]
                    ${item.highlight ? "bg-red-500" : "bg-black"}
                    transition-transform duration-200 origin-left
                    ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"}
                  `}
                />
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0 sm:gap-0.5 ml-auto lg:ml-0 flex-shrink-0">
            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setActiveMenu(null);
              }}
              aria-label="Search"
              className={`p-2 sm:p-2.5 transition-colors duration-150 ${searchOpen ? "text-black" : "text-black/50 hover:text-black"}`}
            >
              {searchOpen ? (
                <X size={17} strokeWidth={1.8} />
              ) : (
                <Search size={17} strokeWidth={1.8} />
              )}
            </button>
            <Link
              href="/login"
              aria-label="Account"
              className="p-2 sm:p-2.5 text-black/50 hover:text-black transition-colors duration-150"
            >
              <User size={17} strokeWidth={1.8} />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden xs:flex p-2 sm:p-2.5 text-black/50 hover:text-black transition-colors duration-150"
            >
              <Heart size={17} strokeWidth={1.8} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 sm:p-2.5 text-black/50 hover:text-black transition-colors duration-150"
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-[5px] right-[5px] w-[14px] h-[14px] rounded-full bg-black text-white text-[7.5px] font-semibold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`
            overflow-hidden transition-[max-height,opacity] duration-200 ease-out
            border-t border-black/[0.05]
            ${searchOpen ? "max-h-[80px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Search
              size={14}
              strokeWidth={1.8}
              className="text-black/30 flex-shrink-0"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, categories…"
              tabIndex={searchOpen ? 0 : -1}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-black placeholder:text-black/30"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[10px] tracking-[0.12em] uppercase text-black/35 hover:text-black transition-colors flex-shrink-0 ml-2"
            >
              Close
            </button>
          </div>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex flex-wrap items-center gap-2">
            <span className="text-[9px] tracking-[0.18em] uppercase text-black/30 mr-1">
              Trending
            </span>
            {["Oud", "Fresh", "Jersey", "Gift Sets"].map((t) => (
              <button
                key={t}
                tabIndex={searchOpen ? 0 : -1}
                className="border border-black/10 px-3 py-1 text-[10px] tracking-[0.06em] uppercase text-black/45 hover:border-black hover:text-black transition-all duration-150"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mega menu */}
        <div
          className={`
            hidden lg:block overflow-hidden bg-white border-t border-black/[0.05]
            transition-[max-height,opacity] duration-[220ms] ease-out
            ${activeMenu && !searchOpen ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={activeMenu === item.label ? "block" : "hidden"}
            >
              <div className="max-w-[1400px] mx-auto px-8 py-9 flex gap-12 flex-wrap">
                {item.columns.map((col, i) => (
                  <div key={i} className="flex flex-col min-w-[120px]">
                    {col.title && (
                      <span className="text-[8px] font-semibold tracking-[0.3em] uppercase text-black/30 mb-4 block">
                        {col.title}
                      </span>
                    )}
                    <ul className="flex flex-col">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={closeAll}
                            className="block py-[7px] text-[13px] font-light leading-snug text-black/55 hover:text-black transition-colors duration-150"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {i === 0 && (
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        className="mt-5 text-[9px] font-semibold tracking-[0.16em] uppercase text-black border-b border-black pb-0.5 w-fit hover:opacity-40 transition-opacity duration-150"
                      >
                        View all →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ══ MOBILE BACKDROP ══════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[110] bg-black/20 transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ══ MOBILE DRAWER ════════════════════════════════════════ */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-[120]
          w-[280px] xs:w-[300px] sm:w-[320px] bg-white flex flex-col
          transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="h-[60px] sm:h-[64px] px-4 sm:px-5 flex items-center justify-between border-b border-black/[0.06] flex-shrink-0">
          <Link href="/" onClick={closeAll}>
            <Image
              src="/ravelle_logo.png"
              alt="Ravelle"
              width={72}
              height={26}
              className="object-contain w-[64px] sm:w-[72px]"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-black/35 hover:text-black transition-colors"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Drawer search */}
        <div className="px-4 sm:px-5 py-3 border-b border-black/[0.05]">
          <div className="flex items-center gap-2.5 border-b border-black/20 pb-2">
            <Search
              size={13}
              strokeWidth={1.8}
              className="text-black/30 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Search…"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-black placeholder:text-black/30"
            />
          </div>
        </div>

        {/* Accordion nav */}
        <nav className="flex-1 overflow-y-auto overscroll-contain">
          {NAV_ITEMS.map((item) => {
            const hasLinks =
              item.columns.length > 0 && item.columns[0].links.length > 0;
            const isExpanded = mobileExpanded === item.label;
            return (
              <div key={item.label} className="border-b border-black/[0.05]">
                <button
                  onClick={() =>
                    hasLinks
                      ? setMobileExpanded(isExpanded ? null : item.label)
                      : closeAll()
                  }
                  className={`
                    w-full flex items-center justify-between
                    px-4 sm:px-5 py-[13px] sm:py-[14px]
                    text-[13px] font-medium tracking-[0.06em] uppercase
                    transition-colors duration-150
                    ${
                      item.highlight
                        ? "text-red-500"
                        : isExpanded
                          ? "text-black"
                          : "text-black/55 hover:text-black"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.label === "New In" && (
                      <span className="text-[6.5px] font-semibold bg-black text-white px-[5px] py-[2px] leading-none">
                        NEW
                      </span>
                    )}
                  </span>
                  {hasLinks && (
                    <ChevronDown
                      size={13}
                      strokeWidth={2}
                      className={`text-black/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                <div
                  className={`
                    overflow-hidden transition-[max-height,opacity] duration-200 ease-out bg-black/[0.015]
                    ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  {item.columns.map((col, ci) => (
                    <div key={ci} className="px-4 sm:px-5 py-3">
                      {col.title && (
                        <span className="block text-[8px] font-semibold tracking-[0.24em] uppercase text-black/30 mb-2">
                          {col.title}
                        </span>
                      )}
                      {col.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={closeAll}
                          className="block py-2.5 text-[13px] font-light text-black/60 hover:text-black border-b border-black/[0.04] last:border-none transition-colors duration-150"
                        >
                          {link.label}
                        </Link>
                      ))}
                      {ci === 0 && (
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          className="inline-block mt-3 text-[9px] font-semibold tracking-[0.15em] uppercase text-black border-b border-black pb-0.5 hover:opacity-40 transition-opacity"
                        >
                          View all →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer links */}
          <div className="px-4 sm:px-5 pt-6 pb-8 grid grid-cols-2 gap-x-4 gap-y-4">
            {["Account", "Wishlist", "Track Order", "About", "Contact"].map(
              (l) => (
                <Link
                  key={l}
                  href={`/${slugify(l)}`}
                  onClick={closeAll}
                  className="text-[10px] sm:text-[10.5px] font-medium tracking-[0.12em] uppercase text-black/35 hover:text-black transition-colors"
                >
                  {l}
                </Link>
              ),
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
