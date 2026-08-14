import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Bike Price In Bangladesh",
  description: "The terms that govern your use of Bike Price In Bangladesh.",
  alternates: { canonical: "https://bikepriceinbangladesh.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: August 2026</p>

        <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Acceptance of Terms</h2>
            <p>
              By accessing or using Bike Price In Bangladesh, you agree to
              these terms. If you don&apos;t agree, please don&apos;t use the
              site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Use of the Site</h2>
            <p>
              This site is provided for personal, non-commercial research
              into motorcycle prices and specifications in Bangladesh. You
              agree not to scrape, republish, or resell our compiled data or
              editorial content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">No Warranty on Pricing</h2>
            <p>
              While we work to keep prices and specifications accurate and
              current, motorcycle prices in Bangladesh can change without
              notice. Always confirm the final price directly with an
              authorized dealer or showroom before making a purchase
              decision. See our{" "}
              <Link href="/disclaimer" className="font-semibold text-blue-600 hover:underline">
                Disclaimer
              </Link>{" "}
              for more detail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Intellectual Property</h2>
            <p>
              Original content — including comparisons, reviews, and
              editorial write-ups — belongs to Bike Price In Bangladesh.
              Manufacturer names, logos, and trademarks belong to their
              respective owners and are used for identification purposes
              only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Limitation of Liability</h2>
            <p>
              Bike Price In Bangladesh is not liable for any loss or damage
              arising from decisions made based on information found on this
              site, including pricing discrepancies between our listings and
              actual showroom prices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of
              the site after changes are posted means you accept the revised
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:imtious.islam.me@gmail.com" className="font-semibold text-blue-600 hover:underline">
                imtious.islam.me@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}