"use client";

import { bikes } from "@/data/bike";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DropdownItem = { label: string; href: string; sublabel?: string };
type NavItem = { label: string; href: string; dropdown?: DropdownItem[] };

const TOP5_DROPDOWN: DropdownItem[] = [
  { label: "Under ৳1.5 Lakh", href: "/" },
  { label: "৳1.5 – 3 Lakh", href: "/" },
  { label: "৳3 – 5 Lakh", href: "/" },
  { label: "৳5 Lakh+", href: "/" },
];

const BEST_DROPDOWN: DropdownItem[] = [
  { label: "Best Mileage Bikes", href: "/" },
  { label: "Best Sports Bikes", href: "/" },
  { label: "Best Under ৳1.5 Lakh", href: "/" },
  { label: "Best Selling Bikes", href: "/" },
];

const OTHER_DROPDOWN: DropdownItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Market Insights", href: "/market" },
  { label: "Contact", href: "/contact" },
];

const SUB_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Bike Price", href: "/" },
  { label: "Compare", href: "/compare" },
  { label: "Top 5", href: "/", dropdown: TOP5_DROPDOWN },
  { label: "Best", href: "/", dropdown: BEST_DROPDOWN },
  { label: "Upcoming", href: "/" },
  { label: "Reviews", href: "/blogs" },
  { label: "Tips", href: "/blogs" },
  { label: "Other", href: "/", dropdown: OTHER_DROPDOWN },
];

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

// ─── Wheel logo mark ──────────────────────────────────────────────────────────
function WheelMark({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 flex-shrink-0"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="16" stroke="#1155F5" strokeWidth="2" />
      <circle
        cx="18"
        cy="18"
        r="9"
        stroke="#1155F5"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <g
        style={{
          transformOrigin: "18px 18px",
          transition: spinning
            ? "none"
            : "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
          animation: spinning ? "wheelSpin 0.9s linear infinite" : "none",
        }}
      >
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={18 + 16 * Math.cos((a * Math.PI) / 180)}
            y1={18 + 16 * Math.sin((a * Math.PI) / 180)}
            x2={18 + 16 * Math.cos(((a + 180) * Math.PI) / 180)}
            y2={18 + 16 * Math.sin(((a + 180) * Math.PI) / 180)}
            stroke="#1155F5"
            strokeWidth="1.2"
            opacity="0.6"
          />
        ))}
      </g>
      <circle cx="18" cy="18" r="3" fill="#4FB8FF" />
      <circle cx="18" cy="18" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke="#0B1B3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{
          transformOrigin: "12px 6px",
          transform: open ? "rotate(45deg) translateY(6px)" : "none",
          transition: "transform 0.25s ease",
        }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="#0B1B3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ opacity: open ? 0 : 1, transition: "opacity 0.15s ease" }}
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke="#0B1B3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{
          transformOrigin: "12px 18px",
          transform: open ? "rotate(-45deg) translateY(-6px)" : "none",
          transition: "transform 0.25s ease",
        }}
      />
    </svg>
  );
}

function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3 h-3 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "none" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function MotoHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [logoHover, setLogoHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);

  // Which dropdown (by label) is currently open — shared between the main
  // nav and the sub-nav row since only one should ever be open at a time.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setLineWidth(100), 600);
    return () => clearTimeout(t);
  }, []);

  const onScroll = useCallback(() => setScrolled(window.scrollY > 24), []);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSearchOpen(false);
      setOpenDropdown(null);
      setQuery("");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Live search results — matches bike name or brand, case-insensitive.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return bikes
      .filter((b) => `${b.name} ${b.brand}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  // Brand dropdown, built from real bike data — top 8 brands by model count,
  // plus a link to view everything.
  const brandDropdown: DropdownItem[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bikes) counts.set(b.brand, (counts.get(b.brand) ?? 0) + 1);
    const top = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([brand, count]) => ({
        label: brand,
        href: `/?brand=${encodeURIComponent(brand)}`,
        sublabel: `${count} ${count === 1 ? "model" : "models"}`,
      }));
    return [...top, { label: "View All Brands", href: "/" }];
  }, []);

  const MAIN_NAV: NavItem[] = [
    { label: "Blogs", href: "/blogs" },
    { label: "Bikes", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Market", href: "/market" },
    { label: "Brands", href: "/", dropdown: brandDropdown },
  ];

  function closeEverything() {
    setOpenDropdown(null);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "border-b" : "border-b border-transparent"}`}
        style={{
          borderBottomColor: scrolled ? "rgba(17,85,245,0.12)" : "transparent",
          background: scrolled
            ? "rgba(255,255,255,0.86)"
            : "linear-gradient(to bottom,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.4) 100%)",
          backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "blur(6px)",
          WebkitBackdropFilter: scrolled
            ? "blur(18px) saturate(160%)"
            : "blur(6px)",
          boxShadow: scrolled
            ? "0 8px 24px -16px rgba(17,85,245,0.25)"
            : "none",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 h-[2px] pointer-events-none transition-all duration-1000 ease-out"
          aria-hidden="true"
          style={{
            width: `${lineWidth}%`,
            background:
              "linear-gradient(90deg,#1155F5 0%,#4FB8FF 55%,transparent 100%)",
            opacity: 0.8,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link
              href="/"
              className={`flex items-center gap-3 group outline-none transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
              aria-label="MotoX — go to homepage"
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
              onFocus={() => setLogoHover(true)}
              onBlur={() => setLogoHover(false)}
            >
              <WheelMark spinning={logoHover} />
              <span className="flex flex-col leading-none">
                <span
                  className="font-black tracking-[-0.04em]"
                  style={{ fontSize: "1.35rem", color: "#0B1B3A" }}
                >
                  MOTO<span style={{ color: "#1155F5" }}>X</span>
                </span>
                <span
                  className="text-[9px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: "rgba(17,85,245,0.55)", marginTop: "1px" }}
                >
                  Superbike Series
                </span>
              </span>
            </Link>

            {/* Desktop main nav */}
            <nav
              aria-label="Primary navigation"
              className={`hidden md:flex items-center gap-1 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
              style={{ transitionDelay: "150ms" }}
            >
              {MAIN_NAV.map((item, i) => {
                const isOpen = openDropdown === item.label;
                const isActive = activeItem === item.href && !item.dropdown;
                return (
                  <div key={item.label} className="relative">
                    {item.dropdown ? (
                      <button
                        className="relative group px-4 py-2 outline-none flex items-center gap-1"
                        style={{ transitionDelay: `${i * 60}ms` }}
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.label)
                        }
                        aria-expanded={isOpen}
                      >
                        <span
                          className="relative z-10 text-xs font-bold tracking-[0.14em] uppercase transition-colors duration-200"
                          style={{
                            color: isOpen ? "#1155F5" : "rgba(11,27,58,0.4)",
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            color: isOpen ? "#1155F5" : "rgba(11,27,58,0.4)",
                          }}
                        >
                          <CaretIcon open={isOpen} />
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="relative group px-4 py-2 outline-none block"
                        style={{ transitionDelay: `${i * 60}ms` }}
                        onMouseEnter={() => setActiveItem(item.href)}
                        onMouseLeave={() => setActiveItem(null)}
                        onFocus={() => setActiveItem(item.href)}
                        onBlur={() => setActiveItem(null)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span
                          className="relative z-10 text-xs font-bold tracking-[0.14em] uppercase transition-colors duration-200"
                          style={{
                            color: isActive ? "#0B1B3A" : "rgba(11,27,58,0.4)",
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 block"
                          aria-hidden="true"
                          style={{
                            width: isActive ? "28px" : "0px",
                            height: "2px",
                            background:
                              "linear-gradient(90deg,#1155F5,#4FB8FF)",
                            transition:
                              "width 0.2s cubic-bezier(0.23,1,0.32,1)",
                            transform: "translateX(-50%) skewX(-18deg)",
                            transformOrigin: "left center",
                          }}
                        />
                      </Link>
                    )}

                    {/* Dropdown panel */}
                    {item.dropdown && isOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div
                          className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 min-w-[220px] rounded-2xl overflow-hidden"
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid rgba(17,85,245,0.12)",
                            boxShadow: "0 20px 40px -16px rgba(11,27,58,0.25)",
                          }}
                        >
                          {item.dropdown.map((d) => (
                            <Link
                              key={d.label}
                              href={d.href}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors"
                            >
                              <span
                                className="text-sm font-semibold"
                                style={{ color: "#0B1B3A" }}
                              >
                                {d.label}
                              </span>
                              {d.sublabel && (
                                <span
                                  className="text-xs"
                                  style={{ color: "rgba(11,27,58,0.35)" }}
                                >
                                  {d.sublabel}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right actions */}
            <div
              className={`hidden md:flex items-center gap-3 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}`}
              style={{ transitionDelay: "250ms" }}
            >
              <div className="relative">
                <button
                  className="p-2 rounded-full outline-none group"
                  aria-label="Search motorcycles"
                  onClick={() => setSearchOpen((v) => !v)}
                  style={{
                    color: searchOpen ? "#1155F5" : "rgba(11,27,58,0.4)",
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-4 h-4 group-hover:text-[#1155F5] transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <circle cx="8.5" cy="8.5" r="5.5" />
                    <line x1="12.5" y1="12.5" x2="17" y2="17" />
                  </svg>
                </button>

                {searchOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                    />
                    <div
                      className="absolute z-50 top-full right-0 mt-2 w-80 rounded-2xl overflow-hidden"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(17,85,245,0.12)",
                        boxShadow: "0 20px 40px -16px rgba(11,27,58,0.25)",
                      }}
                    >
                      <div
                        className="flex items-center gap-2 px-4 py-3"
                        style={{
                          borderBottom: "1px solid rgba(17,85,245,0.08)",
                        }}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="rgba(11,27,58,0.35)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        >
                          <circle cx="8.5" cy="8.5" r="5.5" />
                          <line x1="12.5" y1="12.5" x2="17" y2="17" />
                        </svg>
                        <input
                          ref={searchInputRef}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search bikes or brands..."
                          className="w-full text-sm outline-none"
                          style={{ color: "#0B1B3A" }}
                        />
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {query.trim() === "" ? (
                          <p
                            className="px-4 py-6 text-center text-sm"
                            style={{ color: "rgba(11,27,58,0.35)" }}
                          >
                            Start typing to search bikes
                          </p>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((b) => (
                            <Link
                              key={b.slug}
                              href={`/bikes/${b.slug}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setQuery("");
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors"
                            >
                              <div
                                className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden"
                                style={{ background: "rgba(17,85,245,0.05)" }}
                              >
                                <Image
                                  src={
                                    b.images?.primary || "/placeholder-bike.png"
                                  }
                                  alt={b.name}
                                  fill
                                  className="object-contain p-1"
                                  sizes="44px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "#0B1B3A" }}
                                >
                                  {b.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "rgba(11,27,58,0.4)" }}
                                >
                                  {b.brand} • {formatPrice(b.price)}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p
                            className="px-4 py-6 text-center text-sm"
                            style={{ color: "rgba(11,27,58,0.35)" }}
                          >
                            No bikes match &quot;{query}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <span
                className="w-px h-5"
                style={{ background: "rgba(17,85,245,0.15)" }}
                aria-hidden="true"
              />
              <a
                href="#configure"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2.5 overflow-hidden rounded-full outline-none"
                style={{
                  background: "#1155F5",
                  color: "#FFFFFF",
                  boxShadow: "0 10px 24px -10px rgba(17,85,245,0.5)",
                }}
                aria-label="Configure your MotoX"
              >
                <span className="relative z-10 text-xs font-black tracking-[0.1em] uppercase">
                  Configure
                </span>
                <span
                  className="relative z-10 text-xs transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
                <span
                  className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                  style={{ background: "#4FB8FF" }}
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full outline-none"
              style={{
                border: "1px solid rgba(17,85,245,0.2)",
                background: "rgba(17,85,245,0.04)",
              }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Sub-navigation row (desktop only) */}
        <div
          className="hidden md:block"
          style={{
            background: "#FFFFFF",
            borderTop: "1px solid rgba(17,85,245,0.08)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <nav
              aria-label="Quick filters"
              className="flex items-center gap-1 h-11 auto scrollbar-hide"
            >
              {SUB_NAV.map((item) => {
                const isOpen = openDropdown === `sub:${item.label}`;
                return (
                  <div key={item.label} className="relative flex-shrink-0">
                    {item.dropdown ? (
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md outline-none hover:bg-blue-50 transition-colors"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : `sub:${item.label}`)
                        }
                        aria-expanded={isOpen}
                      >
                        <span
                          className="text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap"
                          style={{
                            color: isOpen ? "#1155F5" : "rgba(11,27,58,0.55)",
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            color: isOpen ? "#1155F5" : "rgba(11,27,58,0.4)",
                          }}
                        >
                          <CaretIcon open={isOpen} />
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <span
                          className="text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap"
                          style={{ color: "rgba(11,27,58,0.55)" }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    )}

                    {item.dropdown && isOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div
                          className="absolute z-50 top-full left-0 mt-1 min-w-[200px] rounded-xl overflow-hidden"
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid rgba(17,85,245,0.12)",
                            boxShadow: "0 16px 32px -14px rgba(11,27,58,0.25)",
                          }}
                        >
                          {item.dropdown.map((d) => (
                            <Link
                              key={d.label}
                              href={d.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors"
                              style={{ color: "#0B1B3A" }}
                            >
                              {d.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden overflow-hidden"
          style={{
            maxHeight: menuOpen ? "720px" : "0px",
            transition: "max-height 0.35s cubic-bezier(0.23,1,0.32,1)",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(24px)",
            borderTop: menuOpen ? "1px solid rgba(17,85,245,0.1)" : "none",
            overflowY: "auto",
          }}
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {/* Mobile search */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-full mb-3"
              style={{
                border: "1px solid rgba(17,85,245,0.15)",
                background: "rgba(17,85,245,0.03)",
              }}
            >
              <svg
                viewBox="0 0 20 20"
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="rgba(11,27,58,0.35)"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="8.5" cy="8.5" r="5.5" />
                <line x1="12.5" y1="12.5" x2="17" y2="17" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bikes or brands..."
                className="w-full text-sm outline-none bg-transparent"
                style={{ color: "#0B1B3A" }}
              />
            </div>
            {query.trim() !== "" && (
              <div className="mb-4">
                {searchResults.length > 0 ? (
                  searchResults.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/bikes/${b.slug}`}
                      onClick={() => {
                        setMenuOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 py-2.5"
                      style={{ borderBottom: "1px solid rgba(11,27,58,0.06)" }}
                    >
                      <div
                        className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden"
                        style={{ background: "rgba(17,85,245,0.05)" }}
                      >
                        <Image
                          src={b.images?.primary || "/placeholder-bike.png"}
                          alt={b.name}
                          fill
                          className="object-contain p-1"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "#0B1B3A" }}
                        >
                          {b.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(11,27,58,0.4)" }}
                        >
                          {formatPrice(b.price)}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p
                    className="text-sm py-2"
                    style={{ color: "rgba(11,27,58,0.35)" }}
                  >
                    No bikes match &quot;{query}&quot;
                  </p>
                )}
              </div>
            )}

            {MAIN_NAV.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-3.5 outline-none group"
                style={{
                  borderBottom: "1px solid rgba(11,27,58,0.06)",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 0.3s ease ${i * 60 + 100}ms, transform 0.3s ease ${i * 60 + 100}ms`,
                }}
                onClick={() => {
                  setMenuOpen(false);
                  closeEverything();
                }}
              >
                <span
                  className="text-sm font-bold tracking-[0.12em] uppercase group-hover:text-[#1155F5] transition-colors duration-150"
                  style={{ color: "rgba(11,27,58,0.6)" }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "#1155F5" }}
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            ))}

            {/* Sub-nav links, flattened for mobile */}
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(11,27,58,0.06)" }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
                style={{ color: "rgba(11,27,58,0.35)" }}
              >
                Browse
              </p>
              <div className="flex flex-wrap gap-2">
                {SUB_NAV.flatMap((item) =>
                  item.dropdown ? item.dropdown : [item],
                ).map((d) => (
                  <a
                    key={d.label}
                    href={d.href}
                    onClick={() => {
                      setMenuOpen(false);
                      closeEverything();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(17,85,245,0.06)",
                      color: "#1155F5",
                    }}
                  >
                    {d.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#configure"
              className="mt-5 flex items-center justify-center gap-2 py-3.5 rounded-full"
              style={{
                background: "#1155F5",
                color: "#FFFFFF",
                boxShadow: "0 10px 24px -10px rgba(17,85,245,0.5)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.3s ease ${MAIN_NAV.length * 60 + 100}ms, transform 0.3s ease ${MAIN_NAV.length * 60 + 100}ms`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-sm font-black tracking-[0.1em] uppercase">
                Configure Your Moto
              </span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      <style>{`
        @keyframes wheelSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
}
