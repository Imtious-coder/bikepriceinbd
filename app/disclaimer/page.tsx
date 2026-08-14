import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Bike Price In Bangladesh",
  description:
    "Important information about the accuracy and use of pricing and specification data on Bike Price In Bangladesh.",
  alternates: { canonical: "https://bikepriceinbangladesh.com/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Disclaimer</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: August 2026</p>

        <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">General Information Only</h2>
            <p>
              Prices, specifications, mileage figures, and other details on
              Bike Price In Bangladesh are provided for general informational
              purposes. While we verify data against manufacturer and dealer
              sources, prices can change without notice due to import duties,
              currency fluctuation, and distributor decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Confirm Before You Buy</h2>
            <p>
              Always confirm the final on-road price, availability, and
              specifications with an authorized showroom or distributor
              before making a purchase. Figures such as mileage and top speed
              are approximate and can vary with riding conditions, load, and
              maintenance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Not Affiliated With Manufacturers</h2>
            <p>
              Bike Price In Bangladesh is an independent publisher and is not
              affiliated with, endorsed by, or officially connected to any
              motorcycle manufacturer or distributor named on this site.
              Brand names and logos are used for identification purposes
              only and remain the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Rider Reviews</h2>
            <p>
              Rider reviews published on this site reflect individual
              opinions and experiences, not the views of Bike Price In
              Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Report an Error</h2>
            <p>
              If you find a price or specification that looks incorrect or
              outdated, please{" "}
              <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
                contact us
              </Link>{" "}
              and we&apos;ll review it against our sources.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}