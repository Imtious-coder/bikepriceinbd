"use client";

import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

interface MousePos {
  x: number;
  y: number;
}
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

// ─── Palette ───────────────────────────────────────────────────────────────
// Background:    #FFFFFF (pure white)
// Panel/alt bg:  #F4F8FD (soft ice blue)
// Primary blue:  #1155F5 (electric royal blue — the brand's signature)
// Deep navy:     #0B1B3A (headline / text ink)
// Sky accent:    #4FB8FF (secondary, used sparingly for glow/highlights)
// Muted ink:     rgba(11,27,58,0.55) (body copy)

// ─── Motorcycle SVG ───────────────────────────────────────────────────────────
function MotoSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 580 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1155F5" />
          <stop offset="100%" stopColor="#4FB8FF" />
        </linearGradient>
        <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1B3A" />
          <stop offset="60%" stopColor="#1155F5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F4F8FD" />
        </linearGradient>
        <linearGradient id="faringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1B3A" />
          <stop offset="100%" stopColor="#1155F5" />
        </linearGradient>
      </defs>

      {/* ── Rear wheel ── */}
      <circle cx="130" cy="210" r="78" stroke="#1155F5" strokeWidth="5" opacity="0.1" />
      <circle
        cx="130"
        cy="210"
        r="78"
        stroke="#1155F5"
        strokeWidth="2"
        strokeDasharray="10 7"
        className="animate-spin-slow"
        style={{ transformOrigin: "130px 210px" }}
      />
      <circle cx="130" cy="210" r="54" stroke="#1155F5" strokeWidth="1.2" opacity="0.3" />
      {[0, 25, 50, 75, 100, 125, 150, 175].map((a) => (
        <line
          key={a}
          x1={130}
          y1={210}
          x2={130 + 78 * Math.cos((a * Math.PI) / 180)}
          y2={210 + 78 * Math.sin((a * Math.PI) / 180)}
          stroke="#1155F5"
          strokeWidth="1.2"
          opacity="0.35"
        />
      ))}
      <circle cx="130" cy="210" r="78" stroke="#0B1B3A" strokeWidth="10" opacity="0.05" />
      <circle cx="130" cy="210" r="8" fill="#1155F5" opacity="0.9" />
      <circle cx="130" cy="210" r="3" fill="#FFFFFF" />

      {/* ── Front wheel ── */}
      <circle cx="450" cy="210" r="72" stroke="#1155F5" strokeWidth="5" opacity="0.1" />
      <circle
        cx="450"
        cy="210"
        r="72"
        stroke="#1155F5"
        strokeWidth="2"
        strokeDasharray="10 7"
        className="animate-spin-slow"
        style={{ transformOrigin: "450px 210px", animationDirection: "reverse" }}
      />
      <circle cx="450" cy="210" r="50" stroke="#1155F5" strokeWidth="1.2" opacity="0.3" />
      {[10, 35, 60, 85, 110, 135, 160, 185].map((a) => (
        <line
          key={a}
          x1={450}
          y1={210}
          x2={450 + 72 * Math.cos((a * Math.PI) / 180)}
          y2={210 + 72 * Math.sin((a * Math.PI) / 180)}
          stroke="#1155F5"
          strokeWidth="1.2"
          opacity="0.35"
        />
      ))}
      <circle cx="450" cy="210" r="72" stroke="#0B1B3A" strokeWidth="10" opacity="0.05" />
      <circle cx="450" cy="210" r="8" fill="#1155F5" opacity="0.9" />
      <circle cx="450" cy="210" r="3" fill="#FFFFFF" />

      {/* ── Swingarm ── */}
      <line x1="130" y1="210" x2="250" y2="175" stroke="#1155F5" strokeWidth="6" strokeLinecap="round" />
      <line x1="130" y1="210" x2="250" y2="185" stroke="#1155F5" strokeWidth="3" strokeLinecap="round" opacity="0.35" />

      {/* ── Engine block ── */}
      <rect x="210" y="170" width="80" height="55" rx="6" fill="#0B1B3A" stroke="#1155F5" strokeWidth="1.5" opacity="0.9" />
      <rect x="220" y="178" width="25" height="18" rx="3" fill="#4FB8FF" opacity="0.3" />
      <rect x="252" y="178" width="25" height="18" rx="3" fill="#4FB8FF" opacity="0.3" />
      <line x1="215" y1="200" x2="285" y2="200" stroke="#4FB8FF" strokeWidth="1" opacity="0.4" />
      <path d="M285 195 Q310 200 320 215 Q325 225 310 228" stroke="#1155F5" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M285 205 Q312 210 322 225 Q327 234 313 237" stroke="#4FB8FF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* ── Main frame spine ── */}
      <path d="M250 175 Q260 140 310 125 L370 118" stroke="url(#frameGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M310 125 Q330 130 340 155 L330 185" stroke="#0B1B3A" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M370 118 L370 145 Q370 160 355 170 L290 180" stroke="#4FB8FF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* ── Fuel tank ── */}
      <path
        d="M295 118 Q320 105 360 108 Q378 110 380 125 Q382 140 365 148 Q340 155 305 148 Q285 142 285 130 Q285 118 295 118Z"
        fill="url(#tankGrad)"
        stroke="#1155F5"
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path d="M305 115 Q330 108 358 112" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />

      {/* ── Fairing / bodywork ── */}
      <path
        d="M370 118 Q395 110 418 115 Q440 120 448 138 Q452 148 445 155 Q430 160 415 155 Q398 148 388 135 Q378 122 370 118Z"
        fill="url(#faringGrad)"
        stroke="#4FB8FF"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <line x1="395" y1="125" x2="430" y2="128" stroke="#FFFFFF" strokeWidth="1" opacity="0.35" />
      <line x1="393" y1="132" x2="428" y2="135" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" />

      {/* ── Headlight ── */}
      <ellipse cx="450" cy="128" rx="18" ry="12" fill="#0B1B3A" stroke="#4FB8FF" strokeWidth="2" />
      <ellipse cx="450" cy="128" rx="10" ry="7" fill="#4FB8FF" opacity="0.7" />
      <path d="M465 122 L510 108 M465 128 L514 126 M465 134 L510 145" stroke="#4FB8FF" strokeWidth="1" opacity="0.2" strokeLinecap="round" />

      {/* ── Front fork ── */}
      <line x1="430" y1="148" x2="450" y2="210" stroke="#0B1B3A" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <line x1="440" y1="148" x2="458" y2="210" stroke="#0B1B3A" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <line x1="435" y1="170" x2="453" y2="175" stroke="#4FB8FF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* ── Seat ── */}
      <path
        d="M305 148 Q322 143 340 145 Q350 148 345 158 Q338 165 318 163 Q302 160 302 153Z"
        fill="#0B1B3A"
        stroke="#1155F5"
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path d="M308 149 Q325 144 338 147" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" fill="none" />

      {/* ── Rear fairing / tail ── */}
      <path
        d="M325 158 Q340 155 355 158 Q362 163 355 172 Q345 178 330 176 Q318 172 318 165Z"
        fill="#1155F5"
        stroke="#0B1B3A"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <ellipse cx="356" cy="165" rx="5" ry="3.5" fill="#4FB8FF" opacity="0.9" />

      {/* ── Handlebar / clip-ons ── */}
      <line x1="420" y1="118" x2="410" y2="108" stroke="#0B1B3A" strokeWidth="4" strokeLinecap="round" />
      <line x1="406" y1="106" x2="422" y2="104" stroke="#1155F5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="407" cy="106" r="3.5" fill="#4FB8FF" />
      <circle cx="421" cy="104" r="3.5" fill="#4FB8FF" />

      {/* ── Ground shadow ── */}
      <ellipse cx="290" cy="292" rx="185" ry="7" fill="#1155F5" opacity="0.06" />

      {/* ── Speed lines ── */}
      <line x1="15" y1="175" x2="72" y2="175" stroke="#1155F5" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <line x1="8" y1="192" x2="58" y2="192" stroke="#1155F5" strokeWidth="1" opacity="0.18" strokeLinecap="round" />
      <line x1="20" y1="208" x2="65" y2="208" stroke="#4FB8FF" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="5" y1="220" x2="45" y2="220" stroke="#4FB8FF" strokeWidth="0.8" opacity="0.12" strokeLinecap="round" />
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function MotoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.2 + 0.6,
        speed: Math.random() * 20 + 14,
        opacity: Math.random() * 0.3 + 0.08,
      })),
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => setMouse({ x: 0, y: 0 }));
  }, []);

  const tiltX = mouse.y * -12;
  const tiltY = mouse.x * 14;
  const shiftX = mouse.x * 18;
  const shiftY = mouse.y * 8;

  return (
    <>
      <Head>
        <title>MotoX — Born to Dominate the Road</title>
        <meta
          name="description"
          content="MotoX superbikes engineered for raw power, precision handling, and pure adrenaline. Explore our flagship 1000cc inline-four lineup."
        />
        <meta name="keywords" content="superbike, motorcycle, MotoX, 1000cc, sportbike, performance motorcycle" />
        <meta property="og:title" content="MotoX — Born to Dominate the Road" />
        <meta property="og:description" content="Raw power. Zero compromise. Discover MotoX superbikes." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://motox.bike/" />
      </Head>

      <section
        ref={containerRef}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center select-none py-20"
        style={{ background: "#FFFFFF" }}
        aria-label="MotoX hero — Born to Dominate the Road"
      >
        {/* Soft grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,85,245,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(17,85,245,0.05) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
            transform: `translate(${shiftX * 0.3}px,${shiftY * 0.3}px)`,
            transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            width: "72vw",
            height: "72vw",
            maxWidth: 900,
            maxHeight: 900,
            top: "50%",
            left: "50%",
            transform: `translate(-50%,-50%) translate(${mouse.x * 30}px,${mouse.y * 20}px)`,
            background:
              "radial-gradient(ellipse at center,rgba(79,184,255,0.16) 0%,rgba(17,85,245,0.08) 45%,transparent 70%)",
            transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: "#1155F5",
                opacity: p.opacity,
                animation: `floatUp ${p.speed}s linear infinite`,
                animationDelay: `-${(p.id * 1.3) % p.speed}s`,
              }}
            />
          ))}
        </div>

        {/* Scene */}
        <div
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0"
          style={{ perspective: "1200px" }}
        >
          {/* Copy */}
          <div
            className="flex-1 flex flex-col gap-6 lg:pr-8"
            style={{
              transform: `perspective(1200px) rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.3}deg)`,
              transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            {/* Eyebrow */}
            <div
              className={`flex items-center gap-3 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="inline-block h-px w-10" style={{ background: "linear-gradient(90deg,#1155F5,transparent)" }} />
              <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#1155F5" }}>
                2025 Superbike Series
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`font-black leading-none transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                transitionDelay: "200ms",
                fontSize: "clamp(3rem,7vw,6.5rem)",
                letterSpacing: "-0.03em",
                color: "#0B1B3A",
              }}
            >
              BORN TO
              <br />
              <span
                style={{
                  WebkitTextStroke: "2px #1155F5",
                  color: "transparent",
                  display: "block",
                }}
              >
                DOMINATE
              </span>
              <span style={{ color: "#1155F5" }}>THE ROAD.</span>
            </h1>

            {/* Body */}
            <p
              className={`text-base md:text-lg leading-relaxed max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "350ms", color: "rgba(11,27,58,0.55)", fontWeight: 400 }}
            >
              999cc inline-four. 210 horsepower. Aerodynamic bodywork carved in a wind tunnel.
              The MotoX R1 doesn't ask permission — it takes the corner before you finish thinking.
            </p>

            {/* Stats */}
            <div
              className={`flex gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "450ms" }}
            >
              {[
                { val: "210", unit: "hp", label: "Peak power" },
                { val: "0.9", unit: "s", label: "0–100 km/h" },
                { val: "299", unit: "km/h", label: "Top speed" },
              ].map(({ val, unit, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-3xl" style={{ color: "#0B1B3A", letterSpacing: "-0.04em" }}>
                      {val}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "#1155F5" }}>
                      {unit}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "rgba(11,27,58,0.4)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "550ms" }}
            >
              <a
                href="#configure"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm tracking-wide overflow-hidden rounded-full"
                style={{
                  background: "#1155F5",
                  color: "#FFFFFF",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 12px 28px -8px rgba(17,85,245,0.55)",
                }}
                aria-label="Build your MotoX R1"
              >
                <span className="relative z-10">Build Yours</span>
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
                <span
                  className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                  style={{ background: "#4FB8FF" }}
                />
              </a>
              <a
                href="#explore"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm tracking-wide rounded-full border"
                style={{
                  borderColor: "rgba(17,85,245,0.25)",
                  color: "#1155F5",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "#F4F8FD",
                }}
                aria-label="Explore the full MotoX range"
              >
                Explore Range
              </a>
            </div>
          </div>

          {/* Motorcycle scene */}
          <div
            className="flex-1 flex items-center justify-center relative"
            style={{
              transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(30px)`,
              transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
              transformStyle: "preserve-3d",
            }}
            aria-hidden="true"
          >
            {/* Glow halo */}
            <div
              className="absolute"
              style={{
                width: "85%",
                paddingBottom: "50%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse,rgba(79,184,255,0.22) 0%,transparent 70%)",
                top: "10%",
                left: "7.5%",
                filter: "blur(24px)",
              }}
            />

            {/* Badge */}
            <div
              className={`absolute top-4 right-4 lg:top-6 lg:right-6 transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              style={{
                transitionDelay: "700ms",
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(17,85,245,0.18)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "8px 14px",
                boxShadow: "0 8px 24px -10px rgba(17,85,245,0.25)",
              }}
            >
              <span className="block text-xs font-bold tracking-widest uppercase" style={{ color: "#1155F5" }}>
                R1 Superbike
              </span>
              <span className="block text-xs mt-0.5" style={{ color: "rgba(11,27,58,0.45)" }}>
                From $18,999
              </span>
            </div>

            {/* Spec callout */}
            <div
              className={`absolute bottom-8 left-0 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              style={{
                transitionDelay: "800ms",
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(17,85,245,0.18)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "8px 12px",
                boxShadow: "0 8px 24px -10px rgba(17,85,245,0.25)",
              }}
            >
              <span className="block text-xs" style={{ color: "#1155F5" }}>
                999cc Inline-Four
              </span>
              <span className="block text-xs font-bold mt-0.5" style={{ color: "#0B1B3A" }}>
                Titanium Exhaust
              </span>
            </div>

            <MotoSVG className="w-full max-w-xl relative z-10" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "1000ms" }}
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(11,27,58,0.3)", letterSpacing: "0.2em" }}>
            Scroll
          </span>
          <div className="w-px h-10 relative overflow-hidden" style={{ background: "rgba(17,85,245,0.15)" }}>
            <div
              className="absolute top-0 w-full"
              style={{
                height: "40%",
                background: "linear-gradient(to bottom,#1155F5,transparent)",
                animation: "scrollDrop 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          aria-hidden="true"
          style={{
            background: "linear-gradient(90deg,transparent 0%,#1155F5 40%,#4FB8FF 60%,transparent 100%)",
            opacity: 0.35,
          }}
        />

        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0px) scale(1);    opacity: var(--op,0.2); }
            50%  { transform: translateY(-40px) scale(1.1); }
            100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
          }
          @keyframes scrollDrop {
            0%   { transform: translateY(-100%); }
            100% { transform: translateY(300%);  }
          }
          .animate-spin-slow { animation: spin 10s linear infinite; }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-spin-slow { animation: none; }
            * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
          }
        `}</style>
      </section>
    </>
  );
}