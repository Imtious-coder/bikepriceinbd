"use client";

import { useEffect, useState } from "react";

// ─── Palette (sampled from reference) ──────────────────────────────────────
// Panel dark:   #1C1D1F
// Panel darker: #101012
// Accent lime:  #E4E934
// White:        #FFFFFF
// Muted text:   #9CA0A6

function DotGrid({
  className,
  color = "#FFFFFF",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`grid grid-cols-3 gap-1.5 ${className ?? ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{ width: 4, height: 4, background: color, opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

function ClassicSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="classicTitle"
    >
      <title id="classicTitle">Royal Enfield Classic 350</title>

      <ellipse
        cx="280"
        cy="265"
        rx="200"
        ry="10"
        fill="#000000"
        opacity="0.35"
      />

      {/* rear wheel */}
      <circle cx="150" cy="200" r="60" fill="#050A17" />
      <circle cx="150" cy="200" r="60" stroke="#D9DDE3" strokeWidth="3" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * 360) / 16;
        return (
          <line
            key={i}
            x1={150}
            y1={200}
            x2={150 + 56 * Math.cos((a * Math.PI) / 180)}
            y2={200 + 56 * Math.sin((a * Math.PI) / 180)}
            stroke="#D9DDE3"
            strokeWidth="0.8"
            opacity="0.6"
            className="wheel-spin"
            style={{ transformOrigin: "150px 200px" }}
          />
        );
      })}
      <circle cx="150" cy="200" r="12" fill="#D9DDE3" />
      <circle cx="150" cy="200" r="5" fill="#1C1D1F" />

      {/* front wheel */}
      <circle cx="425" cy="200" r="56" fill="#050A17" />
      <circle cx="425" cy="200" r="56" stroke="#D9DDE3" strokeWidth="3" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * 360) / 16;
        return (
          <line
            key={i}
            x1={425}
            y1={200}
            x2={425 + 52 * Math.cos((a * Math.PI) / 180)}
            y2={200 + 52 * Math.sin((a * Math.PI) / 180)}
            stroke="#D9DDE3"
            strokeWidth="0.8"
            opacity="0.6"
            className="wheel-spin"
            style={{ transformOrigin: "425px 200px" }}
          />
        );
      })}
      <circle cx="425" cy="200" r="11" fill="#D9DDE3" />
      <circle cx="425" cy="200" r="5" fill="#1C1D1F" />

      <path
        d="M118 165 Q150 138 185 158"
        stroke="#D9DDE3"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M150 200 L245 182"
        stroke="#3A3D44"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <circle
        cx="262"
        cy="192"
        r="30"
        fill="#3A3D44"
        stroke="#E4E934"
        strokeWidth="1.5"
      />
      <circle
        cx="262"
        cy="192"
        r="21"
        fill="none"
        stroke="#E4E934"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle
        cx="262"
        cy="192"
        r="13"
        fill="none"
        stroke="#E4E934"
        strokeWidth="1"
        opacity="0.35"
      />
      <rect
        x="248"
        y="168"
        width="28"
        height="16"
        rx="2"
        fill="#1C1D1F"
        stroke="#E4E934"
        strokeWidth="1"
      />
      <path
        d="M290 195 Q330 198 350 208 Q365 213 358 220 L310 218"
        fill="#D9DDE3"
        opacity="0.9"
      />

      <path
        d="M245 182 Q255 145 300 128 L365 118"
        stroke="#E4E934"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M283 118 Q305 102 340 106 Q360 109 360 126 Q359 143 335 148 Q305 153 285 138 Q276 128 283 118Z"
        fill="#E4E934"
      />
      <path
        d="M292 114 Q315 105 345 112"
        stroke="#1C1D1F"
        strokeWidth="1.5"
        opacity="0.35"
        fill="none"
      />
      <path
        d="M283 128 L360 128"
        stroke="#1C1D1F"
        strokeWidth="1.5"
        opacity="0.5"
      />

      <path
        d="M300 148 Q325 142 350 148 Q358 154 348 162 L302 156 Q298 152 300 148Z"
        fill="#050A17"
      />

      <circle
        cx="378"
        cy="118"
        r="19"
        fill="#D9DDE3"
        stroke="#1C1D1F"
        strokeWidth="1.5"
      />
      <circle cx="378" cy="118" r="13" fill="#1C1D1F" />
      <circle
        cx="378"
        cy="118"
        r="8"
        fill="#E4E934"
        className="headlight-pulse"
      />

      <line
        x1="392"
        y1="132"
        x2="422"
        y2="200"
        stroke="#3A3D44"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="400"
        y1="132"
        x2="428"
        y2="200"
        stroke="#D9DDE3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path
        d="M398 172 Q425 160 452 172"
        stroke="#D9DDE3"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M365 118 Q372 100 390 96"
        stroke="#1C1D1F"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="378"
        y1="98"
        x2="402"
        y2="94"
        stroke="#D9DDE3"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="401" cy="94" r="3" fill="#E4E934" />

      <path
        d="M270 205 Q310 218 355 218"
        stroke="#D9DDE3"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="345"
        y="212"
        width="34"
        height="13"
        rx="6"
        fill="#050A17"
        stroke="#D9DDE3"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const socials = [
  {
    name: "Twitter",
    path: "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.5 11.5 0 0 1 3.4 4.6a4 4 0 0 0 1.3 5.4c-.6 0-1.3-.2-1.8-.5v.1a4 4 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.4a11.4 11.4 0 0 0 6.3 1.9c7.5 0 11.7-6.5 11.7-12v-.6c.8-.6 1.5-1.3 2-2.1Z",
  },
  {
    name: "Instagram",
    path: "M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.4.5.6.2 1.1.6 1.6 1.1.5.5.8.9 1.1 1.6.3.6.4 1.3.5 2.4V16.3c-.1 1.1-.2 1.8-.5 2.4-.3.7-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.3.4-2.4.5H7.9c-1.1-.1-1.8-.2-2.4-.5-.7-.3-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.4-1.3-.5-2.4V7.7c.1-1.1.2-1.8.5-2.4.3-.7.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.4-.5C9 2 9.3 2 12 2Zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7a2.9 2.9 0 0 0-.7-1.1 2.9 2.9 0 0 0-1.1-.7c-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm4.9-2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z",
  },
  {
    name: "Facebook",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.2-1.5 1.6-1.5h1.6V3.7C15.9 3.6 15 3.5 14 3.5c-2.4 0-4 1.5-4 4.1v2.3H7.3V13H10v8h3.5Z",
  },
  {
    name: "WhatsApp",
    path: "M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.9 12.6 8.1 8.1 0 0 1-9.6 3.2l-.5-.2-3 .8.8-2.9-.2-.5A8.2 8.2 0 0 1 12 3.8Zm-2.7 3.9c-.2 0-.5 0-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.1 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .6.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4l-1.7-.8c-.2-.1-.4-.2-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5Z",
  },
];

export default function PromoBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative w-full mx-auto aspect-[820/312] md:aspect-[1000/312] overflow-hidden shadow-2xl top-[65px] md:top-[116px] mb-4 md:mb-[70px]"
      style={{ background: "#1C1D1F" }}
      aria-label="Street racing motorcycle promo banner"
    >
      {/* diagonal shade split */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, #232427 0%, #232427 38%, #101012 60%, #101012 100%)",
        }}
        aria-hidden="true"
      />

      {/* decorative ring — left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          left: -70,
          bottom: -50,
          border: "18px solid #E4E934",
          opacity: 0.85,
        }}
        aria-hidden="true"
      />
      {/* decorative ring — right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 150,
          height: 150,
          right: -60,
          top: "38%",
          transform: "translateY(-50%)",
          border: "16px solid #E4E934",
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* halftone dot texture, top-left & bottom-right corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#E4E934 1px, transparent 1.4px)",
          backgroundSize: "7px 7px",
          maskImage:
            "radial-gradient(120px 90px at 6% 8%, black 0%, transparent 70%), radial-gradient(140px 100px at 96% 92%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(120px 90px at 6% 8%, black 0%, transparent 70%), radial-gradient(140px 100px at 96% 92%, black 0%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      {/* logo */}
      {/* <div
        className={`absolute top-3 left-4 flex items-center gap-1.5 transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#E4E934"
          aria-hidden="true"
        >
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="17" r="3" />
          <path
            d="M6 17l4-8h4l2 4h3M10 9l2-3h3"
            stroke="#E4E934"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
        <span className="text-[10px] font-bold tracking-wide text-white uppercase">
          Logo
        </span>
      </div> */}

      {/* dot grid under logo */}
      <DotGrid className="absolute top-9 left-4" />

      {/* save badge */}
      <div
        className={`absolute top-6 left-14 md:left-20 flex flex-col items-center justify-center rounded-full transition-all duration-700 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{
          width: 56,
          height: 56,
          border: "5px solid #E4E934",
          background: "#1C1D1F",
        }}
      >
        <span className="text-[9px] font-bold text-white leading-none">
          BIG
        </span>
        <span
          className="text-xs font-black leading-none"
          style={{ color: "#E4E934" }}
        >
          BODY
        </span>
      </div>

      {/* motorcycle */}
      <div
        className={`absolute inset-y-0 left-[22%] md:left-[27%] w-[52%] md:h-[330px] md:w-[46%] flex items-center justify-center transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bike-float w-full">
          <ClassicSVG className="w-full h-auto" />
        </div>
      </div>

      {/* right content */}
      <div className="absolute top-3 right-4 md:right-6 flex flex-col items-end gap-1 text-right">
        <div
          className={`flex items-center gap-1 transition-all duration-700 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <span style={{ color: "#E4E934" }} className="text-[10px]">
            ‹‹
          </span>
          <h1 className="leading-none">
            <span className="block text-[13px] md:text-base font-extrabold text-white tracking-wide">
              STREET RACING
            </span>
            <span
              className="block text-[13px] md:text-base font-extrabold tracking-wide"
              style={{ color: "#E4E934" }}
            >
              MOTORCYCLE
            </span>
          </h1>
          <span style={{ color: "#E4E934" }} className="text-[10px]">
            ››
          </span>
        </div>
        <p className="text-[8px] md:text-[10px]" style={{ color: "#9CA0A6" }}>
          Find the perfect motorbike for rent today
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span
            className="block rounded-full"
            style={{ width: 6, height: 6, background: "#E4E934" }}
          />
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA0A6"
            strokeWidth="2"
          >
            <path
              d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"
              strokeLinecap="round"
            />
            <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" />
          </svg>
        </div>

        <DotGrid className="mt-1" />
      </div>

      {/* social row */}
      {/* <div className="absolute bottom-3 right-4 md:right-6 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          {socials.map((s) => (
            <a
            href="#"
              key={s.name}
              className="flex items-center justify-center rounded-full"
              style={{ width: 16, height: 16, background: "#E4E934" }}
              aria-label={s.name}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#1C1D1F">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div> */}

      {/* phone */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#E4E934">
          <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.5c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.1 2.1Z" />
        </svg>
        <span className="text-[9px] font-semibold text-white">
          +88016355016
        </span>
      </div>

      {/* book now */}
      <a
        href="/BikesPage"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[10px] font-black tracking-wider uppercase"
        style={{
          border: "1.5px dashed #E4E934",
          color: "#E4E934",
          background: "rgba(28,29,31,0.6)",
        }}
      >
        ALL BIKES
      </a>

      <style>{`
        .wheel-spin { animation: spin 6s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .bike-float { animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        .headlight-pulse { animation: pulse 2.4s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wheel-spin, .bike-float, .headlight-pulse { animation: none; }
        }
      `}</style>
    </section>
  );
}
