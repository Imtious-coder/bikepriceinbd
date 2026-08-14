import Link from "next/link";

export const metadata = {
  title: "Coming Soon | Bike Price In Bangladesh",
  description:
    "This page isn't available yet. Browse the latest motorcycle prices and specifications in Bangladesh in the meantime.",
  robots: {
    index: false,
    follow: true,
  },
};

function WrenchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.65 2.65a1.5 1.5 0 0 1-2.12 0l-.88-.88a1.5 1.5 0 0 1 0-2.12L14.7 6.3z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
          <WrenchIcon className="h-7 w-7" />
        </div>

        <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
          404 — Coming Soon
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          This page is on its way
        </h1>

        <p className="text-slate-500 leading-relaxed mb-8">
          We&apos;re still building this part of Bike Price In Bangladesh.
          In the meantime, browse the latest motorcycle prices, specs and
          reviews for bikes available in Bangladesh.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/bikes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(17,85,245,0.5)] transition-all hover:bg-blue-500"
          >
            Browse All Bikes
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-blue-100 px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}