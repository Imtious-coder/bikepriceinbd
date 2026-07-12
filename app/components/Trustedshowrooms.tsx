"use client";

import { DIVISIONS, getDivisionCounts, getTotalShowroomCount } from "@/data/showroom";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

// Cycles through a few soft blue tints so cards have gentle rhythm without
// relying on mismatched stock photography.
const CARD_TINTS = [
  "linear-gradient(135deg,#EAF1FF,#F6F9FC)",
  "linear-gradient(135deg,#E5EEFF,#F6F9FC)",
  "linear-gradient(135deg,#EFF5FF,#F6F9FC)",
];

const ICON_GRADIENTS = [
  "linear-gradient(135deg,#1155F5,#4FB8FF)",
  "linear-gradient(135deg,#0B1B3A,#1155F5)",
  "linear-gradient(135deg,#2563EB,#38BDF8)",
];

function StorefrontIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9.5V19a1 1 0 001 1h14a1 1 0 001-1V9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5l1.5-5A1 1 0 015.45 4h13.1a1 1 0 01.95.68l1.5 5.32" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-5a1 1 0 011-1h4a1 1 0 011 1v5" />
    </svg>
  );
}

export default function TrustedShowrooms() {
  const [selectedDivision, setSelectedDivision] = useState("");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const divisionCounts = useMemo(() => getDivisionCounts(), []);
  const total = useMemo(() => getTotalShowroomCount(), []);

  function handleDivisionSelect(division: string) {
    setSelectedDivision(division);
    const el = cardRefs.current[division];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F9FC]">
      <div className="mx-auto max-w-5xl rounded-3xl border border-blue-100 bg-white p-6 sm:p-10 shadow-[0_20px_50px_-24px_rgba(30,64,175,0.25)]">
        {/* Heading row */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get Trusted Bike Showrooms Nearby
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              I am looking to buy a bike in
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <select
              value={selectedDivision}
              onChange={(e) => handleDivisionSelect(e.target.value)}
              className="w-full appearance-none rounded-xl border border-blue-100 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            >
              <option value="">Enter your division</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Division cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {divisionCounts.map(({ division, count }, i) => {
            const isSelected = selectedDivision === division;
            return (
              <div
                key={division}
                ref={(el) => {
                  cardRefs.current[division] = el;
                }}
                onClick={() => handleDivisionSelect(division)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleDivisionSelect(division);
                }}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(17,85,245,0.35)] ${
                  isSelected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white" : ""
                }`}
                style={{ background: CARD_TINTS[i % CARD_TINTS.length] }}
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: ICON_GRADIENTS[i % ICON_GRADIENTS.length] }}
                >
                  <StorefrontIcon />
                </div>
                <p className="text-base font-extrabold leading-snug text-blue-700">
                  {count} Bike Showroom{count === 1 ? "" : "s"} in
                </p>
                <p className="text-sm font-semibold text-slate-700">{division}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-6">
          <Link
            href="/showrooms"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(17,85,245,0.5)] transition-all hover:bg-blue-500 hover:shadow-[0_14px_28px_-10px_rgba(17,85,245,0.55)]"
          >
            See All Showrooms
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Total banner */}
        <div className="rounded-xl bg-blue-50/70 border border-blue-100 py-3 text-center">
          <p className="text-sm font-bold text-blue-700">
            Total: {total} Bike Showroom{total === 1 ? "" : "s"} across Bangladesh
          </p>
        </div>
      </div>
    </section>
  );
}