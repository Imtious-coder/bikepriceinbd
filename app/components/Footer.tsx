import Link from "next/link";

// ─── Content ─────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Bikes", href: "/bikes" },
  { label: "Compare Bikes", href: "/compare" },
  { label: "Bike Showrooms", href: "/showrooms" },
  { label: "Blogs & Reviews", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const POPULAR_BRANDS = [
  { label: "Suzuki", query: "suzuki" },
  { label: "Yamaha", query: "yamaha" },
  { label: "Honda", query: "honda" },
  { label: "Bajaj", query: "bajaj" },
  { label: "TVS", query: "tvs" },
  { label: "Hero", query: "hero" },
  { label: "Royal Enfield", query: "royal-enfield" },
  { label: "CFMOTO", query: "cfmoto" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const CONTACT = {
  phone: "+8801635501600",
  phoneDisplay: "+880 1635-501600",
  email: "imtious.islam.me@gmail.com",
  city: "Dhaka",
  country: "Bangladesh",
};

const CURRENT_YEAR = new Date().getFullYear();

// ─── Icons (inline, no deps) ────────────────────────────────────────────

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16v16H4z" />
      <path d="m4 6 8 7 8-7" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function YoutubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────

export default function Footer() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Bike Price In Bangladesh",
    url: "https://bikepriceinbangladesh.com",
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.city,
      addressCountry: "BD",
    },
    areaServed: "Bangladesh",
    sameAs: [],
  };

  return (
    <footer className="border-t border-blue-100 bg-white mt-16" itemScope itemType="https://schema.org/LocalBusiness">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + NAP */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <LogoIcon className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-sm" itemProp="name">
                Bike Price In Bangladesh
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              An independent motorcycle price, comparison, and review
              platform helping riders across Bangladesh find accurate,
              up-to-date bike prices and specifications.
            </p>

            <address className="mt-5 not-italic space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2">
                <PinIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                <span itemProp="addressLocality">Dhaka</span>,{" "}
                <span itemProp="addressCountry">Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                
                  <a href={`tel:${CONTACT.phone}`}
                  itemProp="telephone"
                  className="hover:text-blue-600 transition-colors"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                
                  <a href={`mailto:${CONTACT.email}`}
                  itemProp="email"
                  className="hover:text-blue-600 transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </p>
            </address>

            {/* Social — update hrefs once accounts are live */}
            <div className="mt-5 flex items-center gap-2">
              
                <a href="#"
                aria-label="Bike Price In Bangladesh on Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              
                <a href="#"
                aria-label="Bike Price In Bangladesh on YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular Brands */}
          <nav aria-label="Popular motorcycle brands">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              Popular Brands
            </h2>
            <ul className="space-y-2.5 text-sm">
              {POPULAR_BRANDS.map((brand) => (
                <li key={brand.query}>
                  <Link
                    href={`/bikes?brand=${brand.query}`}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {brand.label} Bike Price in Bangladesh
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                
                  <a href="/sitemap.xml"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Sitemap
                  <ArrowUpRightIcon className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-500 text-xs sm:text-sm">
            © {CURRENT_YEAR} Bike Price In Bangladesh. All prices listed are
            in BDT and subject to change.
          </p>
          <p className="text-slate-400 text-xs">
            Independently run from Dhaka, Bangladesh — not affiliated with
            any manufacturer or distributor.
          </p>
        </div>
      </div>
    </footer>
  );
}