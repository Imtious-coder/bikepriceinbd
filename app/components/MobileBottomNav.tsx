"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type IconName = "home" | "price" | "bike" | "specs" | "more";

function NavIcon({ name }: { name: IconName }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 20v-7h6v7" /></>,
    price: <><path d="m3 11 8 8 10-10-8-8H3v10Z" /><circle cx="8" cy="6" r="1" /></>,
    bike: <><circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" /><path d="m5 17 4-8h4l5 8M9 9 7 6h3m2 11 3-6h3" /></>,
    specs: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };
  return <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Prices", href: "/bikes", icon: "price" },
  { label: "Brands", href: "/brands", icon: "bike" },
  { label: "Compare", href: "/compare", icon: "specs" },
] as const;

const MORE_ITEMS = [
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const moreActive = MORE_ITEMS.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return <nav aria-label="Mobile site navigation" className="fixed bottom-0 left-0 right-0 z-[60] grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
    {NAV_ITEMS.map((item) => {
      const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center gap-0.5 rounded-t-lg py-2 text-[10px] ${active ? "bg-blue-50 font-bold text-blue-600" : "text-slate-600 hover:text-blue-600"}`}>
        <NavIcon name={item.icon} />{item.label}
      </Link>;
    })}
    <div ref={moreRef} className="relative">
      <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} aria-controls="mobile-more-navigation" className={`flex w-full flex-col items-center gap-0.5 rounded-t-lg py-2 text-[10px] ${moreOpen || moreActive ? "bg-blue-50 font-bold text-blue-600" : "text-slate-600 hover:text-blue-600"}`}><NavIcon name="more" />More</button>
      {moreOpen && <div id="mobile-more-navigation" className="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
        {MORE_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className="block rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700">{item.label}</Link>)}
      </div>}
    </div>
  </nav>;
}
